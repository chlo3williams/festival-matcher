import Link from "next/link";

export default function Home() {
  return (
    <div>
      <div className="flex flex-col items-center justify-center h-screen bg-[rgb(255,244,223)]">
        <img
          src="/logo.png"
          alt="Festival Matcher Logo"
          className="w-1/3 h-auto"
        />
        <Link href="/api/login">
          <button className="bg-[rgb(62,149,71)] text-white px-4 py-2 rounded">
            Login with Spotify
          </button>
        </Link>
        <p className="mt-4 text-center">
          Find your favourite artists to catch live!
          <br />
          Using Spotify's API, we match your top artists with festival lineups.
        </p>
      </div>
    </div>
  );
}
