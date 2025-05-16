import { useRouter } from "next/router";
import { useState, useEffect } from "react";

import { useSpotifyAuth } from "@/hooks/useSpotifyAuth";
import { usePersistentState } from "@/hooks/usePersistentState";
import { Artist } from "@/types/artist";
import { FestivalLineup } from "@/types/festival";
import { RecommendationWithDay } from "@/types/recommendation";
import DayFilter from "@/components/DayFilter";
import FestivalInput from "@/components/FestivalInput";
import MatchCard from "@/components/MatchCard";
import RecommendationCard from "@/components/RecommendationCard";
import SmartRecommendations from "@/components/SmartRecommendations";
import ScheduleModal from "@/components/ScheduleModal";
import { filterAndAttachDayToRecommendations } from "@/utils/filterRecommendations";
import { matchFestivalArtists } from "@/utils/matchArtists";
import TopArtists from "@/components/TopArtists";

export default function LoggedInPage() {
  const router = useRouter();

  const { accessToken, fetchWithAuth, logout } = useSpotifyAuth();

  const [artists, setArtists] = usePersistentState<Artist[]>("spotify_artists", []);
  const [lineup, setLineup] = usePersistentState<FestivalLineup[]>("festival_lineup", []);
  const [festivalName, setFestivalName] = usePersistentState<string>("selected_festival_name", "");
  const [matches, setMatches] = useState<FestivalLineup[]>([]);
  const [recommendations, setRecommendations] = usePersistentState<RecommendationWithDay[]>(
    "festival_recommendations",
    []
  );
  const [showRecommendations, setShowRecommendations] = useState(false);
  const [selectedDay, setSelectedDay] = useState<string>("");
  const [schedule, setSchedule] = usePersistentState<FestivalLineup[]>("festival_schedule", []);
  const [showSchedule, setShowSchedule] = useState(false);

  const filteredMatches = matches.filter((match) => !selectedDay || match.day === selectedDay);
  const filteredRecommendations = recommendations.filter((rec) => !selectedDay || rec.day === selectedDay);

  const addToSchedule = (artist: FestivalLineup) => {
    setSchedule((prev) => {
      const exists = prev.some((item) => item.artist === artist.artist && item.day === artist.day);
      return exists ? prev : [...prev, artist];
    });
  };

  const removeFromSchedule = (artistToRemove: FestivalLineup) => {
    setSchedule((prev) =>
      prev.filter((item) => !(item.artist === artistToRemove.artist && item.day === artistToRemove.day))
    );
  };

  useEffect(() => {
    if (recommendations.length > 0) {
      setShowRecommendations(true);
    }
  }, []);

  useEffect(() => {
    console.log("Matching triggered!", artists.length, lineup.length);
    if (artists.length && lineup.length) {
      const matchedArtists = matchFestivalArtists(artists, lineup);
      setMatches(matchedArtists);
      console.log("Matched artists:", matchedArtists);
    }
  }, [artists, lineup]);

  return (
    <div>
      <button
        onClick={logout}
        className="fixed top-4 right-4 px-3 py-2 bg-red-500 text-white text-sm rounded hover:bg-red-600 shadow-md z-50"
      >
        Logout
      </button>
      <div className="flex flex-col items-center h-screen bg-[rgb(255,244,223)]">
        <img src="/logo.png" alt="Festival Matcher Logo" className="w-1/5 h-auto" />
        <h1>You are now logged in!</h1>

        <button
          onClick={() => setShowSchedule(true)}
          className="fixed top-4 right-24 px-3 py-2  bg-gray-500 hover:bg-gray-600 text-white text-sm rounded shadow-md z-50"
        >
          My Schedule
        </button>

        {accessToken && <TopArtists accessToken={accessToken} onFetched={setArtists} currentArtists={artists} />}

        <FestivalInput onLineupParsed={setLineup} selectedFestival={festivalName} setSelectedFestival={setFestivalName} />

        <h2 className="mt-4">Your personalised Spotify matches:</h2>
        {matches.length === 0 ? (
          <p>No matches yet — pick a lineup!</p>
        ) : (
          <>
            <div className="mt-2">
              <DayFilter
                days={[...new Set([...matches.map((m) => m.day), ...recommendations.map((r) => r.day)])]}
                selectedDay={selectedDay}
                onChange={setSelectedDay}
              />
            </div>

            <div className="grid gap-4 mt-4 sm:grid-cols-2">
              {filteredMatches.map((match, i) => (
                <MatchCard key={i} {...match} onAddToSchedule={addToSchedule} schedule={schedule} />
              ))}
            </div>

            {showRecommendations && recommendations.length > 0 && (
              <>
                <h2 className="mt-8">Smart Recommendations:</h2>
                <div className="mt-8 grid gap-4 sm:grid-cols-2 mr-6 ml-6">
                  {filteredRecommendations.map((rec, i) => (
                    <RecommendationCard key={i} {...rec} onAddToSchedule={addToSchedule} schedule={schedule}/>
                  ))}
                </div>
              </>
            )}
          </>
        )}

        <SmartRecommendations
          topArtists={artists}
          lineup={lineup}
          onRecommendationsFetched={(recommendations) => {
            const filteredRecommendations = filterAndAttachDayToRecommendations(recommendations, lineup);
            setRecommendations(filteredRecommendations);
            setShowRecommendations(true);
          }}
          hasMatches={matches.length > 0}
        />
      </div>

      {showSchedule && (
        <ScheduleModal
          schedule={schedule}
          onClose={() => setShowSchedule(false)}
          onRemoveFromSchedule={removeFromSchedule}
          accessToken={accessToken}
        />
      )}
      <div />
    </div>
  );
}
