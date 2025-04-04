export type Recommendation = {
  artist: string;
  reason: string;
};

export type RecommendationWithDay = Recommendation & { day: string };
