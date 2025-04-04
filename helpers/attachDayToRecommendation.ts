import { FestivalLineup } from "@/types/festival";
import { RecommendationWithDay, Recommendation } from "@/types/recommendation";

export function attachDayToRecommendations(
  recommendations: Recommendation[],
  lineup: FestivalLineup[]
): RecommendationWithDay[] {
  return recommendations.map((rec) => {
    const matched = lineup.find((lineupEntry) => lineupEntry.artist.toLowerCase() === rec.artist.toLowerCase());

    return {
      ...rec,
      day: matched ? matched.day : "day TBC", // fallback if no match found
    };
  });
}