'use strict';

/* ── Number Formatter ────────────────────────────────────── */
function formatVisits(n) {
    if (n === null || n === undefined) return '—';
    if (n >= 1_000_000) {
        const v = n / 1_000_000;
        const s = v % 1 === 0 ? v.toFixed(0) : parseFloat(v.toFixed(1)).toString();
        return s + 'M';
    }
    if (n >= 1_000) {
        const v = n / 1_000;
        const s = v % 1 === 0 ? v.toFixed(0) : parseFloat(v.toFixed(1)).toString();
        return s + 'K';
    }
    return String(n);
}

function formatPlaying(n) {
    if (!n) return '0';
    return formatVisits(n);
}

/* ── Place ID Extractor ──────────────────────────────────── */
function extractPlaceId(url) {
    if (!url) return null;
    const m = url.match(/roblox\.com\/games\/(\d+)/);
    return m ? m[1] : null;
}

/* ── Roblox Live Data ────────────────────────────────────── */
async function enrichFromRoblox(games) {
    const placeIds = [...new Set(
        games.map(g => g.placeId || extractPlaceId(g.gameUrl)).filter(Boolean)
    )];
    if (!placeIds.length) return;

    try {
        const res = await fetch(`/api/roblox?placeIds=${placeIds.join(',')}`);
        if (!res.ok) return;
        const data = await res.json();

        games.forEach(g => {
            const pid = g.placeId || extractPlaceId(g.gameUrl);
            if (!pid || !data[pid]) return;
            const d = data[pid];
            if (d.name) g.title = d.name;
            if (typeof d.visits === 'number') {
                g.liveVisits = d.visits;
                g.liveVisitsFormatted = formatVisits(d.visits);
            }
            if (typeof d.playing === 'number') g.playing = d.playing;
            if (d.thumbnail) g.image = d.thumbnail;
        });
    } catch (err) {
        console.warn('Roblox enrich failed:', err.message);
    }
}

function calcTotalLiveVisits(games) {
    const sum = games.reduce((acc, g) => acc + (g.liveVisits || 0), 0);
    return sum > 0 ? formatVisits(sum) + '+' : null;
}

function updateLiveStats(games) {
    const totalVisits = calcTotalLiveVisits(games);

    const heroVisitsEl = document.getElementById('stat-visits');
    if (heroVisitsEl && totalVisits) heroVisitsEl.textContent = totalVisits;

    const portfolioVisitsEl = document.getElementById('p-visits');
    if (portfolioVisitsEl && totalVisits) portfolioVisitsEl.textContent = totalVisits;

    const portfolioPlayingEl = document.getElementById('p-playing');
    if (portfolioPlayingEl) {
        const playing = games.reduce((acc, g) => acc + (g.playing || 0), 0);
        portfolioPlayingEl.textContent = formatPlaying(playing);
    }

    games.forEach(g => {
        const pid = g.placeId || extractPlaceId(g.gameUrl);
        if (!pid) return;
        document.querySelectorAll(`.game-card[data-place-id="${pid}"]`).forEach(card => {
            const titleEl = card.querySelector('.game-title');
            if (titleEl && g.title && g.title !== 'Loading…') titleEl.textContent = g.title;
            const visEl = card.querySelector('.game-visits-count');
            if (visEl && g.liveVisitsFormatted) visEl.textContent = g.liveVisitsFormatted + ' Visits';
            const playEl = card.querySelector('.game-playing-count');
            if (playEl && typeof g.playing === 'number') {
                playEl.textContent = formatPlaying(g.playing) + ' Playing';
            }
        });
    });
}

/* ── Loading Screen ──────────────────────────────────────── */
function initLoading() {
    const el = document.getElementById('loading');
    if (!el) return;
    const fill = el.querySelector('.loading-bar-fill');
    const duration = (typeof DISPLAY !== 'undefined' ? DISPLAY.loadingDuration : null) || 2000;
    let prog = 0;
    const tick = setInterval(() => {
        prog += Math.random() * 18 + 4;
        if (prog > 100) prog = 100;
        if (fill) fill.style.width = prog + '%';
        if (prog >= 100) {
            clearInterval(tick);
            setTimeout(() => {
                el.classList.add('out');
                setTimeout(() => el.remove(), 700);
            }, 200);
        }
    }, duration / 12);
}

/* ── Custom Cursor ───────────────────────────────────────── */
function initCursor() {
    if (typeof DISPLAY !== 'undefined' && !DISPLAY.enableCursor) return;
    const dot = document.querySelector('.cursor-dot');
    const ring = document.querySelector('.cursor-ring');
    if (!dot || !ring) return;
    let mx = 0, my = 0, rx = 0, ry = 0;
    document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });
    const animate = () => {
        dot.style.left = mx + 'px';
        dot.style.top = my + 'px';
        rx += (mx - rx) * 0.12;
        ry += (my - ry) * 0.12;
        ring.style.left = rx + 'px';
        ring.style.top = ry + 'px';
        requestAnimationFrame(animate);
    };
    animate();
    document.querySelectorAll('a, button, [role="button"], .game-card, .filter-btn').forEach(el => {
        el.addEventListener('mouseenter', () => ring.classList.add('hovering'));
        el.addEventListener('mouseleave', () => ring.classList.remove('hovering'));
    });
}

/* ── Navbar ──────────────────────────────────────────────── */
function initNav() {
    const nav = document.querySelector('.navbar');
    const hamburger = document.querySelector('.hamburger');
    const mobileMenu = document.querySelector('.mobile-menu');
    if (!nav) return;
    window.addEventListener('scroll', () => {
        nav.classList.toggle('scrolled', window.scrollY > 30);
    }, { passive: true });
    if (hamburger && mobileMenu) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('open');
            mobileMenu.classList.toggle('open');
        });
        mobileMenu.querySelectorAll('.nav-link').forEach(l =>
            l.addEventListener('click', () => {
                hamburger.classList.remove('open');
                mobileMenu.classList.remove('open');
            })
        );
    }
    const sections = document.querySelectorAll('section[id]');
    const links = document.querySelectorAll('.nav-link[href*="#"]');
    const io = new IntersectionObserver(entries => {
        entries.forEach(e => {
            if (e.isIntersecting) {
                links.forEach(l => {
                    l.classList.toggle('active', l.getAttribute('href').includes(e.target.id));
                });
            }
        });
    }, { threshold: 0.4 });
    sections.forEach(s => io.observe(s));
}

/* ── Scroll Reveal ───────────────────────────────────────── */
function initScrollReveal() {
    const els = document.querySelectorAll('.reveal, .reveal-left, .reveal-scale');
    if (!els.length) return;
    const io = new IntersectionObserver(entries => {
        entries.forEach(e => {
            if (e.isIntersecting) {
                e.target.classList.add('visible');
                io.unobserve(e.target);
            }
        });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    els.forEach(el => io.observe(el));
}

/* ── Animated Counter ────────────────────────────────────── */
function animateCounter(el, target, suffix = '') {
    const isFloat = target.includes('.');
    const num = parseFloat(target.replace(/[^\d.]/g, ''));
    const start = performance.now();
    const dur = 1800;
    const step = ts => {
        const prog = Math.min((ts - start) / dur, 1);
        const ease = 1 - Math.pow(1 - prog, 3);
        const val = isFloat ? (num * ease).toFixed(1) : Math.round(num * ease);
        el.textContent = val + (target.includes('+') ? '+' : '') + suffix;
        if (prog < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
}

function initHeroStats() {
    if (typeof ME === 'undefined') return;
    const map = {
        'stat-games': ME.totalGames,
        'stat-exp': ME.experience,
    };
    const io = new IntersectionObserver(entries => {
        entries.forEach(e => {
            if (!e.isIntersecting) return;
            Object.entries(map).forEach(([id, val]) => {
                const el = document.getElementById(id);
                if (el) animateCounter(el, val);
            });
            io.disconnect();
        });
    }, { threshold: 0.5 });
    const statsEl = document.querySelector('.hero-stats');
    if (statsEl) io.observe(statsEl);
}

/* ── Skill Progress Bars ─────────────────────────────────── */
function initSkillBars() {
    const bars = document.querySelectorAll('.progress-fill[data-level]');
    if (!bars.length) return;
    const io = new IntersectionObserver(entries => {
        entries.forEach(e => {
            if (!e.isIntersecting) return;
            e.target.style.width = e.target.dataset.level + '%';
            io.unobserve(e.target);
        });
    }, { threshold: 0.4 });
    bars.forEach(b => io.observe(b));
}

/* ── Particles ───────────────────────────────────────────── */
function initParticles() {
    if (typeof DISPLAY !== 'undefined' && !DISPLAY.enableParticles) return;
    const container = document.getElementById('particles');
    if (!container) return;
    const count = 16;
    for (let i = 0; i < count; i++) {
        const p = document.createElement('div');
        p.className = 'particle';
        const size = Math.random() * 3 + 1;
        p.style.cssText = `
            width: ${size}px;
            height: ${size}px;
            left: ${Math.random() * 100}%;
            opacity: ${Math.random() * 0.2 + 0.04};
            animation-duration: ${Math.random() * 15 + 12}s;
            animation-delay: -${Math.random() * 15}s;
        `;
        container.appendChild(p);
    }
}

/* ── Hero Cubes ──────────────────────────────────────────── */
function initHeroCubes() {
    const wrap = document.querySelector('.cubes');
    if (!wrap) return;
    const positions = [
        { top: '15%', right: '8%', size: 40, speed: 10 },
        { top: '60%', right: '15%', size: 24, speed: 14 },
        { top: '30%', right: '30%', size: 18, speed: 18 },
        { top: '75%', right: '5%', size: 32, speed: 12 },
    ];
    positions.forEach(pos => {
        const cw = document.createElement('div');
        cw.className = 'cube-wrap';
        cw.style.cssText = `top:${pos.top};right:${pos.right};width:${pos.size}px;height:${pos.size}px;`;
        cw.innerHTML = `<div class="mini-cube" style="width:${pos.size}px;height:${pos.size}px;animation-duration:${pos.speed}s">
            <div class="face front"></div><div class="face back"></div>
            <div class="face left"></div><div class="face right"></div>
            <div class="face top"></div><div class="face bottom"></div>
        </div>`;
        const faces = cw.querySelectorAll('.face');
        faces.forEach(f => { f.style.width = f.style.height = pos.size + 'px'; });
        cw.querySelector('.front').style.transform = `translateZ(${pos.size / 2}px)`;
        cw.querySelector('.back').style.transform = `rotateY(180deg) translateZ(${pos.size / 2}px)`;
        cw.querySelector('.left').style.transform = `rotateY(-90deg) translateZ(${pos.size / 2}px)`;
        cw.querySelector('.right').style.transform = `rotateY(90deg) translateZ(${pos.size / 2}px)`;
        cw.querySelector('.top').style.transform = `rotateX(90deg) translateZ(${pos.size / 2}px)`;
        cw.querySelector('.bottom').style.transform = `rotateX(-90deg) translateZ(${pos.size / 2}px)`;
        wrap.appendChild(cw);
    });
}

/* ── Music Player ────────────────────────────────────────── */
function initMusic() {
    if (typeof MUSIC === 'undefined' || !MUSIC.enabled) return;
    const player = document.getElementById('music-player');
    if (!player) return;
    if (!MUSIC.track.src) { player.style.display = 'none'; return; }
    const audio = new Audio(MUSIC.track.src);
    audio.loop = true;
    audio.volume = 0.4;
    const playBtn = player.querySelector('.music-play-btn i');
    const bars = player.querySelector('.music-bars');
    const titleEl = player.querySelector('.music-title');
    const artistEl = player.querySelector('.music-artist');
    if (titleEl) titleEl.textContent = MUSIC.track.title || 'Background Music';
    if (artistEl) artistEl.textContent = MUSIC.track.artist || '';
    let playing = false;
    player.querySelector('.music-play-btn').addEventListener('click', () => {
        if (playing) {
            audio.pause();
            if (playBtn) playBtn.className = 'fas fa-play';
            if (bars) bars.classList.remove('playing');
        } else {
            audio.play().catch(() => { });
            if (playBtn) playBtn.className = 'fas fa-pause';
            if (bars) bars.classList.add('playing');
        }
        playing = !playing;
    });
}

/* ── Status Helpers ──────────────────────────────────────── */
function statusClass(status) {
    if (status === 'Live') return 'status-live';
    if (status === 'In Development') return 'status-dev';
    if (status === 'Closed') return 'status-closed';
    if (status === 'Beta') return 'status-beta';
    return 'status-closed';
}

/* ── Game Card ───────────────────────────────────────────── */
function getVisitsDisplay(game) {
    if (game.liveVisitsFormatted) return game.liveVisitsFormatted + ' Visits';
    return game.description || '—';
}

function createGameCard(game) {
    const card = document.createElement('div');
    card.className = 'game-card reveal';
    const pid = game.placeId || extractPlaceId(game.gameUrl);
    if (pid) card.dataset.placeId = pid;

    const playingHtml = typeof game.playing === 'number'
        ? `<span class="game-playing"><i class="fas fa-circle" style="color:var(--green);font-size:0.5rem"></i> <span class="game-playing-count">${formatPlaying(game.playing)} Playing</span></span>`
        : '';

    card.innerHTML = `
        <div class="game-thumb-wrap loading">
            <img class="game-thumb" src="" alt="${game.title}" loading="lazy">
            <div class="game-overlay">
                <div class="overlay-btn">
                    <i class="fas fa-gamepad"></i> View Game
                </div>
            </div>
            <div class="game-status-badge ${statusClass(game.status)}">${game.status}</div>
        </div>
        <div class="game-body">
            <h3 class="game-title">${game.title}</h3>
            <div class="game-meta">
                <span class="game-role-badge">${game.role}</span>
                <span class="game-visits"><i class="fas fa-eye"></i> <span class="game-visits-count">${getVisitsDisplay(game)}</span></span>
            </div>
            ${playingHtml ? `<div class="game-meta-row">${playingHtml}</div>` : ''}
            <div class="game-year"><i class="fas fa-calendar-alt"></i> ${game.year}</div>
            <div class="game-skills">
                ${game.skills.map(s => `<span class="skill-tag">${s}</span>`).join('')}
            </div>
        </div>
    `;

    const thumb = card.querySelector('.game-thumb');
    const wrap = card.querySelector('.game-thumb-wrap');
    if (game.image) {
        thumb.src = game.image;
        thumb.addEventListener('load', () => { thumb.classList.add('loaded'); wrap.classList.remove('loading'); });
        thumb.addEventListener('error', () => { wrap.classList.remove('loading'); });
    } else {
        wrap.classList.remove('loading');
    }

    card.addEventListener('click', () => openModal(game));
    return card;
}

/* ── Render Games ────────────────────────────────────────── */
function renderGames(games, containerId, limit = null) {
    const container = document.getElementById(containerId);
    if (!container) return;
    container.innerHTML = '';
    const list = limit ? games.slice(0, limit) : games;
    list.forEach((game, i) => {
        const card = createGameCard(game);
        card.classList.add(`reveal-delay-${Math.min(i % 3 + 1, 5)}`);
        container.appendChild(card);
    });
    initScrollReveal();
}

/* ── Modal ───────────────────────────────────────────────── */
let modalOverlay;
function initModal() {
    modalOverlay = document.getElementById('modal-overlay');
    if (!modalOverlay) return;
    modalOverlay.addEventListener('click', e => {
        if (e.target === modalOverlay) closeModal();
    });
    document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });
    const closeBtn = modalOverlay.querySelector('.modal-close-btn');
    if (closeBtn) closeBtn.addEventListener('click', closeModal);
}

function openModal(game) {
    if (!modalOverlay) return;
    const img = modalOverlay.querySelector('#modal-img');
    const title = modalOverlay.querySelector('#modal-title');
    const status = modalOverlay.querySelector('#modal-status');
    const role = modalOverlay.querySelector('#modal-role');
    const visits = modalOverlay.querySelector('#modal-visits');
    const year = modalOverlay.querySelector('#modal-year');
    const skills = modalOverlay.querySelector('#modal-skills');
    const playBtn = modalOverlay.querySelector('#modal-play');
    const roleStat = modalOverlay.querySelector('#modal-role-stat');
    const playingEl = modalOverlay.querySelector('#modal-playing');

    if (title) title.textContent = game.title;
    if (status) { status.textContent = game.status; status.className = `game-status-badge ${statusClass(game.status)}`; }
    if (role) role.textContent = game.role;
    if (visits) visits.textContent = game.liveVisitsFormatted ? game.liveVisitsFormatted : game.description;
    if (year) year.textContent = game.year;
    if (roleStat) roleStat.textContent = game.role;
    if (playingEl) {
        playingEl.textContent = typeof game.playing === 'number' ? formatPlaying(game.playing) : '—';
    }
    if (skills) {
        skills.innerHTML = game.skills.map(s => `<span class="skill-tag">${s}</span>`).join('');
    }
    if (img) {
        img.src = game.image || '';
        img.style.display = '';
        img.onerror = () => { img.style.display = 'none'; };
    }
    if (playBtn) {
        if (game.gameUrl) { playBtn.href = game.gameUrl; playBtn.style.display = ''; }
        else { playBtn.style.display = 'none'; }
    }
    modalOverlay.classList.add('open');
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    if (modalOverlay) modalOverlay.classList.remove('open');
    document.body.style.overflow = '';
}

/* ── Back To Top ─────────────────────────────────────────── */
function initBackTop() {
    const btn = document.getElementById('back-top');
    if (!btn) return;
    window.addEventListener('scroll', () => {
        btn.classList.toggle('visible', window.scrollY > 400);
    }, { passive: true });
    btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

/* ── Build Hero From Config ──────────────────────────────── */
function buildHero() {
    if (typeof ME === 'undefined') return;
    const set = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
    set('hero-name', ME.name);
    set('hero-subtitle', ME.subtitle);
    set('hero-desc', ME.description);
    set('nav-name', ME.name);
    set('footer-name', ME.name);
    set('hero-location-text', (ME.location || 'Austria') + ' · Available for Work');
    document.title = `${ME.name} — ${ME.title}`;
    if (ME.favicon) {
        const link = document.querySelector("link[rel='icon']");
        if (link) link.href = ME.favicon;
    }
}

/* ── Build Skills From Config ────────────────────────────── */
function buildSkills() {
    if (typeof SKILLS === 'undefined') return;
    const grid = document.getElementById('skills-grid');
    if (!grid) return;
    grid.innerHTML = '';
    SKILLS.forEach((skill, i) => {
        const card = document.createElement('div');
        card.className = `skill-card reveal reveal-delay-${i + 1}`;
        card.innerHTML = `
            <div class="skill-icon-wrap"><i class="${skill.icon}"></i></div>
            <h3>${skill.name}</h3>
            <div class="skill-badge ${skill.badge.toLowerCase()}">${skill.badge}</div>
            <p class="skill-exp">${skill.experience}</p>
            <p class="skill-desc">${skill.description}</p>
            <div class="progress-track">
                <div class="progress-fill" data-level="${skill.level}" style="width:0"></div>
            </div>
        `;
        grid.appendChild(card);
    });
    initScrollReveal();
    initSkillBars();
}

/* ── Build Process From Config ───────────────────────────── */
function buildProcess() {
    if (typeof PROCESS_STEPS === 'undefined') return;
    const container = document.getElementById('process-steps');
    if (!container) return;
    container.innerHTML = '';
    PROCESS_STEPS.forEach((step, i) => {
        const el = document.createElement('div');
        el.className = `process-step reveal reveal-delay-${i + 1}`;
        el.innerHTML = `
            <div class="step-num">${step.number}</div>
            <h3>${step.title}</h3>
            <p>${step.desc}</p>
            <div class="step-tags">
                ${step.tags.map(t => `<span class="step-tag">${t}</span>`).join('')}
            </div>
        `;
        container.appendChild(el);
    });
    initScrollReveal();
}

/* ── Build Contact From Config ───────────────────────────── */
function buildContact() {
    if (typeof LINKS === 'undefined') return;
    const discordBtn = document.getElementById('discord-btn');
    const robloxBtn = document.getElementById('roblox-btn');
    if (discordBtn) {
        if (LINKS.discord) discordBtn.href = LINKS.discord;
        else discordBtn.style.display = 'none';
    }
    if (robloxBtn) {
        if (LINKS.roblox) robloxBtn.href = LINKS.roblox;
        else robloxBtn.style.display = 'none';
    }
}

/* ── Portfolio Page: Filters ─────────────────────────────── */
function initPortfolioFilters(games) {
    const bar = document.getElementById('filter-bar');
    if (!bar) return;
    const statuses = ['All', ...new Set(games.map(g => g.status))];
    bar.innerHTML = statuses.map(s =>
        `<button class="filter-btn${s === 'All' ? ' active' : ''}" data-filter="${s}">${s}</button>`
    ).join('');
    bar.addEventListener('click', e => {
        const btn = e.target.closest('.filter-btn');
        if (!btn) return;
        bar.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const filter = btn.dataset.filter;
        const filtered = filter === 'All' ? games : games.filter(g => g.status === filter);
        renderGames(filtered, 'portfolio-grid');
    });
}

/* ── Portfolio Page Stats ────────────────────────────────── */
function buildPortfolioStats(games) {
    const set = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
    set('p-total', games.length);
    set('p-live', games.filter(g => g.status === 'Live').length);
    set('p-dev', games.filter(g => g.status === 'In Development').length);
    set('p-closed', games.filter(g => g.status === 'Closed').length);
    set('p-visits', '…');
    set('p-playing', '…');
}

/* ── Re-render After Live Data ───────────────────────────── */
function reRenderWithLiveData(games, containerId, limit) {
    const container = document.getElementById(containerId);
    if (!container) return;
    const wasEmpty = !container.children.length;
    renderGames(games, containerId, limit);
    if (!wasEmpty) updateLiveStats(games);
}

/* ── Init Index Page ─────────────────────────────────────── */
async function initIndex() {
    buildHero();
    buildSkills();
    buildProcess();
    buildContact();
    initMusic();

    const limit = (typeof DISPLAY !== 'undefined' ? DISPLAY.homepageGameCount : null) || 6;
    renderGames(GAMES, 'games-grid', limit);

    await enrichFromRoblox(GAMES);
    renderGames(GAMES, 'games-grid', limit);
    updateLiveStats(GAMES);

    setInterval(async () => {
        await enrichFromRoblox(GAMES);
        updateLiveStats(GAMES);
    }, 30_000);
}

/* ── Init Portfolio Page ─────────────────────────────────── */
async function initPortfolio() {
    buildHero();
    buildContact();
    buildPortfolioStats(GAMES);
    initPortfolioFilters(GAMES);
    renderGames(GAMES, 'portfolio-grid');
    initMusic();

    await enrichFromRoblox(GAMES);
    const activeFilter = document.querySelector('.filter-btn.active');
    const filter = activeFilter ? activeFilter.dataset.filter : 'All';
    const filtered = filter === 'All' ? GAMES : GAMES.filter(g => g.status === filter);
    renderGames(filtered, 'portfolio-grid');
    updateLiveStats(GAMES);

    setInterval(async () => {
        await enrichFromRoblox(GAMES);
        updateLiveStats(GAMES);
    }, 30_000);
}

/* ── Boot ────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
    initLoading();
    initCursor();
    initNav();
    initParticles();
    initHeroCubes();
    initScrollReveal();
    initHeroStats();
    initModal();
    initBackTop();

    const isPortfolio = document.getElementById('portfolio-grid');
    if (isPortfolio) initPortfolio();
    else initIndex();

    console.log('🎮 Boris Portfolio v3 loaded');
});