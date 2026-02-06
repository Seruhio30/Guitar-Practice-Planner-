export function getSuggestions({ type, level, query }) {
  const mockData = [
    { title: "Wonderwall", type: "songs", level: "beginner", source: "Songsterr", url: "#" },
    { title: "Basic Chord Changes", type: "videos", level: "beginner", source: "YouTube", url: "#" },
    { title: "Pentatonic Scale Practice", type: "videos", level: "intermediate", source: "YouTube", url: "#" },
    { title: "Hotel California", type: "songs", level: "advanced", source: "Songsterr", url: "#" }
  ];

  const filtered = mockData.filter(item => item.type === type && item.level === level);

  const q = (query ?? "").trim().toLowerCase();
  const queryFiltered = q
    ? filtered.filter(item => item.title.toLowerCase().includes(q))
    : filtered;

  return queryFiltered;
}
