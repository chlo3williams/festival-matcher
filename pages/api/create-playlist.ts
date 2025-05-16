import type { NextApiRequest, NextApiResponse } from "next";
import SpotifyWebApi from "spotify-web-api-node";

const dedupeUris = (uris: string[]): string[] => {
  const seen: string[] = [];
  return uris.filter((uri) => {
    if (!seen.includes(uri)) {
      seen.push(uri);
      return true;
    }
    return false;
  });
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }
  const { token, schedule } = req.body;

  if (!token || !schedule) {
    res.status(400).json({ error: "Access token and schedule are required" });
    return;
  }

  try {
    const spotifyApi = new SpotifyWebApi();
    spotifyApi.setAccessToken(token);

    const user = await spotifyApi.getMe();
    const userId = user.body.id;

    

    const playlist = await spotifyApi.createPlaylist("My Festival Matcher Playlist", {
      description: "Created with Festival Matcher",
      public: true,
    });

    const trackUris: string[] = [];

    for (const artist of schedule) {
      const result = await spotifyApi.searchTracks(`artist:${artist.artist}`, { limit: 5 });
      const tracks = result?.body?.tracks?.items || [];

      if (tracks.length > 0) {
        const uris = tracks.map((track) => track.uri);
        trackUris.push(...uris);
      }
    }

    const uniqueTrackUris = dedupeUris(trackUris);

    if (uniqueTrackUris.length > 0) {
      await spotifyApi.addTracksToPlaylist(playlist.body.id, uniqueTrackUris);
    }

    return res.status(200).json({
      playlistUrl: playlist.body.external_urls.spotify,
      addedTracks: trackUris.length,
    });
  } catch (error: any) {
    console.error("Failed to create playlist:", error);
    return res.status(500).json({ error: error.message });
  }
}
