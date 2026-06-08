module.exports = async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Cache-Control', 's-maxage=30, stale-while-revalidate=60');

    const { placeIds } = req.query;
    if (!placeIds) return res.status(400).json({ error: 'placeIds required' });

    const ids = placeIds.split(',').map(s => s.trim()).filter(Boolean).slice(0, 50);
    if (!ids.length) return res.json({});

    const headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
        'Accept': 'application/json',
        'Accept-Language': 'en-US,en;q=0.9',
    };

    try {
        // Step 1: resolve placeId -> universeId via apis.roblox.com
        const universeResults = await Promise.all(
            ids.map(pid =>
                fetch(`https://apis.roblox.com/universes/v1/places/${pid}/universe`, { headers })
                    .then(r => r.ok ? r.json() : null)
                    .then(d => d?.universeId ? { placeId: pid, universeId: d.universeId } : null)
                    .catch(() => null)
            )
        );

        const placeToUniverse = {};
        for (const entry of universeResults) {
            if (entry) placeToUniverse[entry.placeId] = entry.universeId;
        }

        const universeIds = [...new Set(Object.values(placeToUniverse))];
        if (!universeIds.length) return res.status(502).json({ error: 'Could not resolve universe IDs', placeIds: ids });

        // Step 2: fetch stats + thumbnails using universeIds
        const [statsRes, thumbRes] = await Promise.all([
            fetch(`https://games.roblox.com/v1/games?universeIds=${universeIds.join(',')}`, { headers }),
            fetch(`https://thumbnails.roblox.com/v1/games/multiget/thumbnails?universeIds=${universeIds.join(',')}&size=768x432&format=Png&isCircular=false`, { headers })
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
            if (byUniverse[uid]) byUniverse[uid].thumbnail = thumb;
            else byUniverse[uid] = { thumbnail: thumb };
        }

        const result = {};
        for (const [placeId, universeId] of Object.entries(placeToUniverse)) {
            result[placeId] = byUniverse[universeId] || null;
        }

        return res.json(result);
    } catch (err) {
        console.error('Roblox API error:', err.message);
        return res.status(500).json({ error: err.message });
    }
}