import type { NextApiRequest, NextApiResponse } from "next";
import SpotifyWebApi from "spotify-web-api-node";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const accessToken = req.query.token as string;

  if (!accessToken) {
    res.status(400).json({ error: "Access token is required" });
    return;
  }
  const spotifyApi = new SpotifyWebApi();
  spotifyApi.setAccessToken(accessToken);

  try {
    const data = await spotifyApi.getMyTopArtists({ limit: 50 });

    const artists = data.body.items.map((artist) => ({
      name: artist.name,
      genres: artist.genres,
      popularity: artist.popularity,
    }));

    res.setHeader('Cache-Control', 'no-store');
    res.status(200).json({artists});
  } catch (error: unknown) {
    if (error instanceof Error) {
      res
        .status(500)
        .json({ error: `Error fetching top artists: ${error.message}` });
    } else {
      res
        .status(500)
        .json({ error: "Error fetching top artists: Unknown error" });
    }
  }
}
