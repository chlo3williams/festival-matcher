import { useState, useEffect } from "react";
import { track } from "@vercel/analytics";
import { usePersistentState } from "@/hooks/usePersistentState";
import { Artist } from "@/types/artist";
import { FestivalLineup } from "@/types/festival";
import { Recommendation } from "@/types/recommendation";

type Props = {
  topArtists: Artist[];
  lineup: FestivalLineup[];
  onRecommendationsFetched: (recommendations: Recommendation[]) => void;
  hasMatches: boolean;
};

export default function SmartRecommendations({ topArtists, lineup, onRecommendationsFetched, hasMatches }: Props) {
  const [isMounted, setIsMounted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [requestsLeft, setRequestsLeft] = usePersistentState<number>("festival_requests_left", 3);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  const fetchRecommendations = async () => {
    if (requestsLeft <= 0) {
      setError("You've used all your smart recommendations for this session.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      track("Smart Recommendations Click", {
        topArtistsCount: topArtists.length,
        lineupCount: lineup.length,
        userHasMatches: hasMatches,
        requestsRemaining: requestsLeft,
      });

      const res = await fetch("/api/recommendations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ topArtists, lineup }),
      });

      const data = await res.json();
      onRecommendationsFetched(data.recommendations || []);
      setRequestsLeft(requestsLeft - 1);
    } catch (error) {
      setError("Failed to fetch recommendations");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {lineup.length > 0 && (
        <div className="mt-8 text-center bg-[rgb(255,244,223)]">
          {!hasMatches && (
            <p className="text-gray-700 mb-4">
              No direct Spotify matches found — but you can still get Smart Recommendations based on your listening!
            </p>
          )}

          <button
            onClick={fetchRecommendations}
            className="px-4 py-2 mb-8 bg-[rgb(62,149,71)] text-white rounded"
            disabled={loading}
          >
            {loading ? "Loading..." : "Get Smart Recommendations"}
          </button>
          <p className="text-sm text-gray-600 mb-4">
            {requestsLeft > 0
              ? `You have ${requestsLeft} smart recommendation${requestsLeft === 1 ? "" : "s"} left.`
              : "You’ve used all your LLM recommendations for now."}
          </p>

          {error && <p className="text-red-500 mt-2">{error}</p>}
        </div>
      )}
    </>
  );
}
