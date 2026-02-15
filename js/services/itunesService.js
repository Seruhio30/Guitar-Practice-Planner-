export async function searchSongsItunes(query, limit = 6) {
    const term = (query ?? "").trim();
    if (!term) return [];

    const url = `https://itunes.apple.com/search?term=${encodeURIComponent(term)}&entity=song&limit=${limit}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`iTunes error: ${res.status}`);

    const data = await res.json();

    // Normalizamos al “shape” de tu app
    return (data.results || []).map((r) => ({
        id: String(r.trackId),
        title: r.trackName,
        subtitle: r.artistName,
        source: "iTunes",
        url: r.trackViewUrl,
        thumbnail: r.artworkUrl100,
        type: "songs",
    }));
}