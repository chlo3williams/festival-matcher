import { useState } from "react";
import { Artist } from "@/types/artist";
import { FestivalLineup } from "@/types/festival";
import { Recommendation } from "@/types/recommendation";
import { getRemainingRequests, decrementRequests, resetRequests } from "@/utils/rateLimit";

type Props = {
  topArtists: Artist[];
  lineup: FestivalLineup[];
  onRecommendationsFetched: (recommendations: Recommendation[]) => void;
};

export default function Recommendations({ topArtists, lineup, onRecommendationsFetched }: Props) {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [requestsLeft, setRequestsLeft] = useState<number>(getRemainingRequests());

  const fetchRecommendations = async () => {
    if (requestsLeft <= 0) {
      setError("You've used all your smart recommendations for this session.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/recommendations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ topArtists, lineup }),
      });

      const data = await res.json();
      onRecommendationsFetched(data.recommendations || []);
      setRecommendations(data.recommendations || []);

      const updated = decrementRequests();
      setRequestsLeft(updated);
    } catch (error) {
      setError("Failed to fetch recommendations");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-8 text-center bg-[rgb(255,244,223)]">
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
      {process.env.NODE_ENV === "development" && (
        <button
          onClick={() => {
            resetRequests();
            setRequestsLeft(3);
          }}
          className="text-sm underline text-blue-600 mb-8"
        >
          Reset LLM request count (dev only)
        </button>
      )}
      {error && <p className="text-red-500 mt-2">{error}</p>}
    </div>
  );
}
