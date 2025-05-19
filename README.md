# 🎪 Festival Matcher

Festival Matcher connects your Spotify listening habits with real-world festival lineups — showing you who to see based on your top artists, and recommending others using OpenAI-powered insights. Plan your perfect weekend with matches, smart suggestions, and generate custom playlists.

## Features

### 🔐 Login with Spotify

Start by logging in via Spotify to fetch your top artists.

![Homepage](/public/screenshot-1.png)


### 🎧 Festival Selection

Choose from the current supported festivals (e.g. Glastonbury 2025, Tramlines 2025). Once selected, the app matches your top Spotify artists with the festival lineup.

### 🤝 Spotify Match Recommendations

Instantly see which artists you already enjoy listening to are playing at the festival. You can filter by day to plan out who to see each day.

Each artist is displayed as a **match card**, and you can click **➕** to add them to your schedule.

![Matches](/public/screenshot-2.png)

### 🧠 Smart Recommendations (LLM-powered)

Even if you don’t have lots of matches or just need some more inspiration, you can get **Smart Recommendations** powered by OpenAI. These suggest artists you might enjoy based on your listening and all from within the lineup.

Clicking **Get Smart Recommendations** uses one of your limited requests (3 per session). This feature helps you find undiscovered gems based on your taste.

![Smart Recommendations](/public/screenshot-3.png)

### 🗓️ My Schedule

All your selected artists go into a personal schedule. Open your **My Schedule** modal to:

- Filter by day
- See all saved artists and stages
- Remove artists
- Export a Spotify playlist

![Schedule](/public/screenshot-4.png)

### 🎵 Spotify Playlist Generation

When you have at least 5 artists in your schedule, you can create and send a playlist directly to your Spotify account. The playlist pulls in top tracks from your selected artists where you can view and listen instantly. 

![Spotify Playlist](/public/screenshot-5.png)

## Tech Stack

- **Next.js** (Pages Router)
- **TypeScript**
- **Spotify Web API**
- **OpenAI API** (GPT-3.5-turbo for recommendations)
- **Tailwind CSS**
- **Vercel Analytics**

## Local Development

```bash
pnpm install
pnpm dev
```

Set your environment variables in .env.local

```bash
SPOTIFY_CLIENT_ID=your_id
SPOTIFY_CLIENT_SECRET=your_secret
NEXT_PUBLIC_REDIRECT_URI=http://localhost:3000/api/callback
OPENAI_API_KEY=your_key
```

## Deployment

Deployed to [Vercel](https://festival-matcher.vercel.app/). Run locally with `pnpm dev`.


## Future Improvements

- More festival lineups!
- Calendar export
- Upgrade persistent state solution

✨ Made by [Chloe Williams](https://github.com/chlo3williams)