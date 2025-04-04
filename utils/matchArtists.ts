import stringSimilarity from "string-similarity";
import { Artist } from "../types/artist";
import { FestivalLineup } from "../types/festival";

export function matchFestivalArtists(
  topArtists: Artist[],
  lineup: FestivalLineup[],
  threshold: number = 0.6
): FestivalLineup[] {
  const topNames = topArtists.map((a) => a.name.toLowerCase());

  return lineup.filter((entry) => {
    const artistName = entry.artist.toLowerCase();
    const matches = stringSimilarity.findBestMatch(artistName, topNames);
    return matches.bestMatch.rating >= threshold;
});
}