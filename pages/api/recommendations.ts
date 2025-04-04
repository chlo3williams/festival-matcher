import type { NextApiRequest, NextApiResponse } from "next";
import OpenAI from "openai";
import { Artist } from "@/types/artist";
import { FestivalLineup } from "@/types/festival";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { topArtists, lineup }: { topArtists: Artist[]; lineup: FestivalLineup[] } = req.body;

  const prompt = `
You are a music recommendation expert.

Here is a user's top Spotify artists:
${topArtists.map((a) => `- ${a.name}`).join("\n")}

Here is the festival lineup:
${lineup.map((a) => `- ${a.artist} (${a.day}, ${a.stage})`).join("\n")}

Suggest up to 20 artists from the lineup that the user might like, based on their top artists (not including the ones they've already matched). For each one, give a short reason why.
Respond as a JSON array: [{"artist": "...", "reason": "..."}]
`;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    const parsed = JSON.parse(completion.choices[0].message.content || "[]");
    res.status(200).json({ recommendations: parsed });
  } catch (error) {
    console.log("OpenAI error:", error);
    res.status(500).json({ error: "Error fetching recommendations" });
  }
}
