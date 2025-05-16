import type { NextApiRequest, NextApiResponse } from "next";
import SpotifyWebApi from "spotify-web-api-node";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const scopes = ["user-top-read", "playlist-modify-public"];
  const spotifyApi = new SpotifyWebApi({
    redirectUri: process.env.SPOTIFY_REDIRECT_URI!,
    clientId: process.env.SPOTIFY_CLIENT_ID!,
    clientSecret: process.env.SPOTIFY_CLIENT_SECRET!,
  });

  const state = Math.random().toString(36).substring(2, 15);
  const authorizeURL = spotifyApi.createAuthorizeURL(scopes, state);

  res.redirect(authorizeURL);
}
