import type { NextApiRequest, NextApiResponse } from "next";
import SpotifyWebApi from "spotify-web-api-node";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const code = req.query.code as string;

  const spotifyApi = new SpotifyWebApi({
    redirectUri: process.env.SPOTIFY_REDIRECT_URI!,
    clientId: process.env.SPOTIFY_CLIENT_ID!,
    clientSecret: process.env.SPOTIFY_CLIENT_SECRET!,
  });

  try {
    const data = await spotifyApi.authorizationCodeGrant(code);
    const accessToken = data.body.access_token;
    const refreshToken = data.body.refresh_token;

    res.redirect(
      `/loggedin?access_token=${accessToken}&refresh_token=${refreshToken}`
    );
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(400).send(`Authentication failed: ${error.message}`);
    } else {
      res.status(400).send("Authentication failed: Unknown error");
    }
  }
}
