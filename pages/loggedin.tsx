import { useRouter } from "next/router";
import { useState, useEffect } from "react";

import { useSpotifyAuth } from "@/hooks/useSpotifyAuth";
import { Artist } from "@/types/artist";
import { FestivalLineup } from "@/types/festival";
import { RecommendationWithDay } from "@/types/recommendation";
import DayFilter from "@/components/DayFilter";
import FestivalInput from "@/components/FestivalInput";
import MatchCard from "@/components/MatchCard";
import RecommendationCard from "@/components/RecommendationCard";
import Recommendations from "@/components/Recommendations";
import { attachDayToRecommendations } from "@/helpers/attachDayToRecommendation";
import { matchFestivalArtists } from "@/utils/matchArtists";

export default function LoggedInPage() {
  const router = useRouter();

  const { accessToken, fetchWithAuth, logout } = useSpotifyAuth();

  const [artists, setArtists] = useState<Artist[]>([]);
  const [lineup, setLineup] = useState<FestivalLineup[]>([]);
  const [matches, setMatches] = useState<FestivalLineup[]>([]);
  const [recommendations, setRecommendations] = useState<RecommendationWithDay[]>([]);
  const [showRecommendations, setShowRecommendations] = useState(false);
  const [selectedDay, setSelectedDay] = useState<string>("");

  const filteredMatches = matches.filter((match) => !selectedDay || match.day === selectedDay);
  const filteredRecommendations = recommendations.filter((rec) => !selectedDay || rec.day === selectedDay);

  // Fetch Spotify top artists
  useEffect(() => {
    if (!accessToken) return;
  
    const getTopArtists = async () => {
      const data = await fetchWithAuth("/api/top-artists");
      setArtists(data.artists || []);
    };
  
    getTopArtists();
  }, [accessToken]);


  // Match artists with festival lineup
  useEffect(() => {
    console.log("Matching triggered!", artists.length, lineup.length);
    if (artists.length && lineup.length) {
      const matchedArtists = matchFestivalArtists(artists, lineup);
      setMatches(matchedArtists);
      console.log("Matched artists:", matchedArtists);
    }
  }, [artists, lineup]);

  return (
    <>
      <button
        onClick={logout}
        className="fixed top-4 right-4 px-3 py-2 bg-red-500 text-white text-sm rounded hover:bg-red-600 shadow-md z-50"
      >
        Logout
      </button>
      <div className="flex flex-col items-center h-screen bg-[rgb(255,244,223)]">
        <img src="/logo.png" alt="Festival Matcher Logo" className="w-1/8 h-auto" />
        <h1>You are now logged in!</h1>
        <FestivalInput onLineupParsed={setLineup} />

        <h2 className="mb-2">Your personalised Spotify matches:</h2>
        {matches.length === 0 ? (
          <p>No matches yet — pick a lineup!</p>
        ) : (
          <>
            <DayFilter
              days={[...new Set([...matches.map((m) => m.day), ...recommendations.map((r) => r.day)])]}
              selectedDay={selectedDay}
              onChange={setSelectedDay}
            />

            <div className="grid gap-4 mt-4 sm:grid-cols-2">
              {filteredMatches.map((match, i) => (
                <MatchCard key={i} {...match} />
              ))}
            </div>

            {showRecommendations && recommendations.length > 0 && (
              <>
                <h2 className="mt-8">Smart Recommendations:</h2>
                <div className="mt-8 grid gap-4 sm:grid-cols-2 mr-6 ml-6">
                  {filteredRecommendations.map((rec, i) => (
                    <RecommendationCard key={i} {...rec} />
                  ))}
                </div>
              </>
            )}
          </>
        )}
        {matches.length > 0 && (
          <Recommendations
            topArtists={artists}
            lineup={lineup}
            onRecommendationsFetched={(recommendations) => {
              const recsWithDay = attachDayToRecommendations(recommendations, lineup);
              setRecommendations(recsWithDay);
              setShowRecommendations(true);
            }}
          />
        )}
      </div>
    </>
  );
}
