module.exports = async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Cache-Control', 's-maxage=30, stale-while-revalidate=60');

    const { placeIds } = req.query;
    if (!placeIds) return res.status(400).json({ error: 'placeIds required' });

    const ids = placeIds.split(',').map(s => s.trim()).filter(Boolean).slice(0, 50);
    if (!ids.length) return res.json({});

    try {
        const placeRes = await fetch(
            `https://games.roblox.com/v1/games/multiget-place-details?placeIds=${ids.join(',')}`
        );
        if (!placeRes.ok) throw new Error(`Place details ${placeRes.status}`);
        const placeData = await placeRes.json();

        const placeToUniverse = {};
        for (const p of (Array.isArray(placeData) ? placeData : [])) {
            if (p.placeId && p.universeId) {
                placeToUniverse[String(p.placeId)] = p.universeId;
            }
        }

        const universeIds = [...new Set(Object.values(placeToUniverse))];
        if (!universeIds.length) return res.json({});

        const [statsRes, thumbRes] = await Promise.all([
            fetch(`https://games.roblox.com/v1/games?universeIds=${universeIds.join(',')}`),
            fetch(`https://thumbnails.roblox.com/v1/games/multiget/thumbnails?universeIds=${universeIds.join(',')}&size=768x432&format=Png&isCircular=false`)
        ]);

        const [statsData, thumbData] = await Promise.all([
            statsRes.json(),
            thumbRes.json()
        ]);

        const byUniverse = {};
        for (const g of (statsData.data || [])) {
            byUniverse[g.id] = { visits: g.visits, playing: g.playing, name: g.name };
        }
        for (const t of (thumbData.data || [])) {
            const uid = t.universeId;
            const thumb = t.thumbnails?.[0]?.imageUrl || '';
            if (byUniverse[uid]) {
                byUniverse[uid].thumbnail = thumb;
            } else {
                byUniverse[uid] = { thumbnail: thumb };
            }
        }

        const result = {};
        for (const [placeId, universeId] of Object.entries(placeToUniverse)) {
            result[placeId] = byUniverse[universeId] || null;
        }

        return res.json(result);
    } catch (err) {
        console.error('Roblox API error:', err.message);
        return res.status(500).json({ error: 'Failed to fetch Roblox data' });
    }
}