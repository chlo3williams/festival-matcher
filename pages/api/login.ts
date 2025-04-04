import type { NextApiRequest, NextApiResponse } from "next";
import SpotifyWebApi from "spotify-web-api-node";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const scopes = ["user-top-read"];
  const spotifyApi = new SpotifyWebApi({
    redirectUri: process.env.SPOTIFY_REDIRECT_URI!,
    clientId: process.env.SPOTIFY_CLIENT_ID!,
    clientSecret: process.env.SPOTIFY_CLIENT_SECRET!,
  });

  const authorizeURL = spotifyApi.createAuthorizeURL(scopes, '');
  res.redirect(authorizeURL);
}
