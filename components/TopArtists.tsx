import useSWR from "swr";
import { Artist } from "@/types/artist";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function TopArtists({
  accessToken,
  onFetched,
  currentArtists,
}: {
  accessToken: string;
  onFetched: (artists: Artist[]) => void;
  currentArtists: Artist[];
}) {
  const { data, error, isLoading } = useSWR(
    accessToken && currentArtists.length === 0 ? `/api/top-artists?token=${accessToken}` : null,
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateIfStale: false,
      revalidateOnReconnect: false,
      dedupingInterval: 60000,
      onSuccess: (data) => {
        if (data?.artists) onFetched(data.artists);
      },
    }
  );

  if (isLoading) return <div>Loading top artists...</div>;
  if (error) return <div>Error loading top artists</div>;

  return null;
}
