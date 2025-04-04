import { useRouter } from "next/router";
import { useState, useEffect } from "react";

import { Artist } from "@/types/artist";
import FestivalInput from "@/components/FestivalInput";
import { FestivalLineup } from "@/types/festival";
import { matchFestivalArtists } from "@/utils/matchArtists";

export default function LoggedInPage() {
  const router = useRouter();
  const { access_token } = router.query;

  const [artists, setArtists] = useState<Artist[]>([]);
  const [lineup, setLineup] = useState<FestivalLineup[]>([]);
  const [matches, setMatches] = useState<FestivalLineup[]>([]);

  // Fetch Spotify top artists
  useEffect(() => {
    if (!access_token) return;

    fetch(`/api/top-artists?token=${access_token}`)
      .then((res) => res.json())
      .then((data) => {
        setArtists(data.artists || []);
      });
  }, [access_token]);

  // Match artists with festival lineup
  useEffect(() => {
    console.log("Matching triggered!", artists.length, lineup.length);
    if (artists.length && lineup.length) {
      const matchedArtists = matchFestivalArtists(artists, lineup);
      setMatches(matchedArtists);
    }
  }, [artists, lineup]);

  return (
    <div className="flex flex-col items-center h-screen bg-[rgb(255,244,223)]">
      <img
        src="/logo.png"
        alt="Festival Matcher Logo"
        className="w-1/8 h-auto"
      />
      <h1>You are now logged in!</h1>
      <FestivalInput onLineupParsed={setLineup} />

      <h2>Your Matches</h2>
      {matches.length === 0 ? (
        <p>No matches yet — pick a lineup!</p>
      ) : (
        <ul>
          {matches.map((m, i) => (
            <li key={i}>
              {m.artist} — {m.day}, {m.stage}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
