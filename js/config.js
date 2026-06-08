// ╔══════════════════════════════════════════════════════════════════╗
// ║          🎮  BORIS PORTFOLIO  —  CONFIGURATION FILE  🎮          ║
// ║                                                                    ║
// ║  This is the ONLY file you need to edit to customize your site.   ║
// ║  Just change the values between quotes and save!                  ║
// ╚══════════════════════════════════════════════════════════════════╝

// ──────────────────────────────────────────────────────────────────────
//  ① YOUR BASIC INFO
// ──────────────────────────────────────────────────────────────────────
const ME = {
    name: "Boris",
    title: "Roblox Game Developer",
    subtitle: "Builder · Scripter · Project Manager",
    description: "Crafting immersive Roblox experiences through detailed building, Lua scripting, and team leadership. Turning ideas into worlds players love.",
    location: "Austria",
    experience: "6",
    totalGames: "40+",
    favicon: "images/Roblox_Studio_icon_2025.png",
};


// ──────────────────────────────────────────────────────────────────────
//  ② CONTACT & SOCIAL LINKS
// ──────────────────────────────────────────────────────────────────────
const LINKS = {
    discord: "https://discord.com/users/391302528530120726",
    roblox: "https://www.roblox.com/users/2024925409/profile",
    youtube: "",
    twitter: "",
    github: "",
};


// ──────────────────────────────────────────────────────────────────────
//  ③ BACKGROUND MUSIC  🎵
// ──────────────────────────────────────────────────────────────────────
const MUSIC = {
    enabled: true,
    autoplay: false,
    track: {
        title: "Ambient Theme",
        artist: "Portfolio BGM",
        src: "",
    }
};


// ──────────────────────────────────────────────────────────────────────
//  ④ YOUR SKILLS
// ──────────────────────────────────────────────────────────────────────
const SKILLS = [
    {
        icon: "fas fa-hammer",
        name: "Builder",
        badge: "Expert",
        level: 90,
        experience: "5 Years",
        description: "Crafting detailed environments, structures, and interactive elements that create immersive worlds players explore and enjoy."
    },
    {
        icon: "fas fa-users-cog",
        name: "Project Manager",
        badge: "Advanced",
        level: 80,
        experience: "3 Years",
        description: "Coordinating development teams, managing project timelines, and ensuring quality gameplay from concept to launch."
    },
    {
        icon: "fas fa-code",
        name: "Scripter",
        badge: "Intermediate",
        level: 40,
        experience: "2 Years",
        description: "Developing game mechanics, user interfaces, and interactive systems using Lua to bring functionality and life to game worlds."
    },
];


// ──────────────────────────────────────────────────────────────────────
//  ⑤ YOUR GAMES  🎮
//
//  HOW TO ADD A GAME — only 4 things required:
//    placeId  → the number from the Roblox URL:
//               roblox.com/games/12345678/Game-Name  →  "12345678"
//    role     → "Builder" / "Scripter" / "Developer" / "Lead Developer"
//               "Founder" / "Co-Founder" / any custom text
//    year     → "2026"
//    status   → "Live" / "In Development" / "Closed" / "Beta"
//    skills   → ["Building", "Scripting"]  (optional tags)
//
//  Title, thumbnail and visit count are fetched automatically from Roblox!
//
//  For games WITHOUT a Roblox URL (e.g. group links), also add:
//    title    → "My Game Name"   (manual fallback)
//    image    → "images/mygame.webp"
// ──────────────────────────────────────────────────────────────────────
const GAMES = [
    {
        placeId: "117946489105796",
        role: "Lead Developer",
        year: "2026",
        status: "Live",
        skills: ["Development Leader", "Building", "Scripting"],
    },
    {
        placeId: "137917254543162",
        role: "Developer",
        year: "2026",
        status: "In Development",
        skills: ["Building", "Scripting"],
    },
    {
        placeId: "87017354625620",
        role: "Developer",
        year: "2026",
        status: "In Development",
        skills: ["Building"],
    },

    {
        placeId: "80368750667927",
        role: "Developer",
        year: "2026",
        status: "In Development",
        skills: ["Building"],
    },

    {
        placeId: "132252466568540",
        role: "Developer",
        year: "2026",
        status: "In Development",
        skills: ["Building"],
    },

    {
        placeId: "125408923887211",
        role: "Developer",
        year: "2026",
        status: "Closed",
        skills: ["Building", "Scripting"],
    },

    {
        placeId: "15673122636",
        role: "Developer",
        year: "2026",
        status: "In Development",
        skills: ["Building", "Scripting"],
    },

    {
        placeId: "124855981322362",
        role: "Developer",
        year: "2026",
        status: "In Development",
        skills: ["Building"],
    },

    {
        placeId: "5538476793",
        role: "Developer",
        year: "2025",
        status: "In Development",
        skills: ["Building"],
    },

    {
        placeId: "4525999910",
        role: "Builder",
        year: "2025",
        status: "Live",
        skills: ["Building"],
    },

    {
        placeId: "81868833187028",
        role: "Lead Developer",
        year: "2025",
        status: "Closed",
        skills: ["Development Leader", "Building"],
    },

    {
        placeId: "135215101417021",
        role: "Builder",
        year: "2025",
        status: "Live",
        skills: ["Building"],
    },

    {
        placeId: "16813393477",
        role: "Scripter",
        year: "2025",
        status: "Live",
        skills: ["Scripting"],
    },

    {
        placeId: "18389247410",
        role: "Developer",
        year: "2025",
        status: "In Development",
        skills: ["Building", "Scripting"],
    },

    {
        placeId: "101282827084357",
        role: "Lead Developer",
        year: "2025",
        status: "Closed",
        skills: ["Development Leader", "Building", "Scripting"],
    },

    {
        placeId: "90741687201221",
        role: "Developer",
        year: "2024",
        status: "Live",
        skills: ["Building"],
    },

    {
        placeId: "15177898242",
        role: "Co-Founder",
        year: "2024",
        status: "Live",
        skills: ["Development Leader", "Building", "Scripting"],
    },

    {
        placeId: "12037478139",
        role: "Developer",
        year: "2024",
        status: "Closed",
        skills: ["Building", "Scripting"],
    },

    {
        placeId: "72118524838278",
        role: "Lead Developer",
        year: "2024",
        status: "Closed",
        skills: ["Development Leader", "Building", "Scripting"],
    },

    {
        placeId: "16671201510",
        role: "Founder",
        year: "2024",
        status: "Closed",
        skills: ["Development Leader", "Building", "Scripting"],
    },

    {
        // No Roblox game URL — manual title + image
        placeId: null,
        title: "Erzgebirgskaserne, Sachsen",
        image: "https://tr.rbxcdn.com/180DAY-42199a2fe3d2b5d4bbb17f3e1e7efbfe/150/150/Image/Webp/noFilter",
        role: "Lead Developer",
        year: "2024",
        status: "In Development",
        skills: ["Development Leader", "Building", "Scripting"],
    },

    {
        placeId: "16277797512",
        role: "Developer",
        year: "2024",
        status: "Live",
        skills: ["Building", "Scripting"],
    },

    {
        placeId: "90337621469883",
        role: "Founder",
        year: "2024",
        status: "Closed",
        skills: ["Development Leader", "Building", "Scripting"],
    },

    {
        // Group link — no place ID
        placeId: null,
        title: "Stadt Essen",
        image: "images/Essen.webp",
        gameUrl: "https://www.roblox.com/communities/13882294/Stadt-Essen#!/about",
        role: "Lead Developer",
        year: "2023",
        status: "Closed",
        skills: ["Development Leader", "Building"],
    },

    {
        placeId: "8765694897",
        role: "Founder",
        year: "2023",
        status: "Closed",
        skills: ["Development Leader", "Building", "Scripting"],
    },

    {
        placeId: "15220895306",
        role: "Lead Developer",
        year: "2023",
        status: "Closed",
        skills: ["Development Leader", "Building", "Scripting"],
    },

    {
        placeId: "14796365158",
        role: "Founder",
        year: "2023",
        status: "Closed",
        skills: ["Development Leader", "Building", "Scripting"],
    },

    {
        placeId: "15211677346",
        role: "Founder",
        year: "2023",
        status: "Closed",
        skills: ["Development Leader", "Building", "Scripting"],
    },

    {
        placeId: "5840410897",
        role: "Builder",
        year: "2020",
        status: "Closed",
        skills: ["Building"],
    },

    /*
    ─── TEMPLATE — Copy this block to add a new game ───────────────────
    {
        placeId: "YOUR_PLACE_ID",
        role:    "Builder",
        year:    "2026",
        status:  "In Development",
        skills:  ["Building"],
    },
    ────────────────────────────────────────────────────────────────────
    */
];


// ──────────────────────────────────────────────────────────────────────
//  ⑥ HOMEPAGE DISPLAY SETTINGS
// ──────────────────────────────────────────────────────────────────────
const DISPLAY = {
    homepageGameCount: 6,
    enableParticles: true,
    enableCursor: true,
    loadingDuration: 2200,
};


// ──────────────────────────────────────────────────────────────────────
//  ⑦ PROCESS STEPS
// ──────────────────────────────────────────────────────────────────────
const PROCESS_STEPS = [
    {
        number: "01",
        title: "Planning & Design",
        desc: "Understanding your game vision and mapping out detailed plans. We define scope, technical requirements, and an achievable timeline.",
        tags: ["Project Planning", "Technical Analysis", "Resource Allocation"],
    },
    {
        number: "02",
        title: "Development & Building",
        desc: "Creating immersive environments, scripting game mechanics with Lua, and building systems that keep players engaged.",
        tags: ["Environment Building", "Lua Scripting", "System Development"],
    },
    {
        number: "03",
        title: "Testing & Launch",
        desc: "Quality assurance testing, performance optimization, team coordination, and successful deployment.",
        tags: ["Quality Testing", "Team Coordination", "Launch Deployment"],
    },
];


// ──────────────────────────────────────────────────────────────────────
//  ⑧ PRICING
// ──────────────────────────────────────────────────────────────────────
const PRICING = {
    note: "Every project is unique — pricing is based on complexity, scope, and timeline. Contact me for a free quote.",
    methods: ["Robux", "PayPal"],
    rate: "From 5,000 Robux",
};


// ═══════════════════════════════════════════════════════════════════════
//  ✅ THAT'S IT! Only edit above.
// ═══════════════════════════════════════════════════════════════════════

// Normalize GAMES: build gameUrl from placeId if not set manually
GAMES.forEach(g => {
    if (g.placeId && !g.gameUrl) {
        g.gameUrl = `https://www.roblox.com/games/${g.placeId}/game`;
    }
    if (!g.title) g.title = 'Loading…';
    if (!g.description) g.description = '— Visits';
});

console.log('✅ Boris Portfolio Config loaded —', GAMES.length, 'games configured');
