
import { searchSongsItunes } from "./services/itunesService.js";

export async function getSuggestions({ type, level, query }) {
  if (type === "songs") {
    const songs = await searchSongsItunes(query, 8);
    // opcional: guardo el level elegido como meta para UI
    return songs.map(s => ({ ...s, level }));
  }

  // videos: no API real por ahora
  return [];
}
