import { FestivalLineup } from "@/types/festival";
import { Recommendation } from "@/types/recommendation";

export function filterAndAttachDayToRecommendations(
  recommendations: Recommendation[],
  lineup: FestivalLineup[],
  matchedArtists: string[] = []
) {
  const lineupArtists = lineup.map((a) => a.artist.toLowerCase());
  const matchedArtistsLower = matchedArtists.map((a) => a.toLowerCase());

  const filtered = recommendations.filter(
    (rec) =>
      lineupArtists.includes(rec.artist.toLowerCase()) &&
      !matchedArtistsLower.includes(rec.artist.toLowerCase())
  );

  return attachDayToRecommendations(filtered, lineup);
}

// Don't forget to import your attachDayToRecommendations helper:
import { attachDayToRecommendations } from "@/helpers/attachDayToRecommendation";
