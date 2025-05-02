import useSWR from "swr";
import { Artist } from "@/types/artist";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function TopArtists({
  accessToken,
  onFetched,
}: {
  accessToken: string;
  onFetched: (artists: Artist[]) => void;
}) {
  const { data, error, isLoading } = useSWR(accessToken ? "/api/top-artists?token=" + accessToken : null, fetcher, {
    revalidateOnFocus: false,
    dedupingInterval: 60000,
    onSuccess: (data) => {
      if (data?.artists) onFetched(data.artists);
    },
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading top artists</div>;

  return null;
}
