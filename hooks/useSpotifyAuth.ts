import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export function useSpotifyAuth() {
  const router = useRouter();
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);

  // Read tokens from URL or localStorage
  useEffect(() => {
    const urlAccess = router.query.access_token as string;
    const urlRefresh = router.query.refresh_token as string;

    const storedAccess = localStorage.getItem("access_token");
    const storedRefresh = localStorage.getItem("refresh_token");

    const access = urlAccess || storedAccess;
    const refresh = urlRefresh || storedRefresh;

    if (access && refresh) {
      setAccessToken(access);
      setRefreshToken(refresh);
      localStorage.setItem("access_token", access);
      localStorage.setItem("refresh_token", refresh);
    }
  }, [router.query]);

  // Refresh expired token
  const refreshAccessToken = async () => {
    if (!refreshToken) return;

    const res = await fetch(`/api/refresh-token?refresh_token=${refreshToken}`);
    const data = await res.json();

    if (res.ok && data.access_token) {
      localStorage.setItem("access_token", data.access_token);
      setAccessToken(data.access_token);
      return data.access_token;
    }

    console.error("Token refresh failed", data);
    return null;
  };

  // Wrapper to use Spotify API with auto-refresh
  const fetchWithAuth = async (url: string): Promise<any> => {
    if (!accessToken) return null;

    let res = await fetch(`${url}?token=${accessToken}`);
    if (res.status === 401) {
      const newAccess = await refreshAccessToken();
      if (newAccess) {
        res = await fetch(`${url}?token=${newAccess}`);
      }
    }
    return await res.json();
  };

  const logout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("festival_schedule");
    localStorage.removeItem("festival_recommendations");
    localStorage.removeItem("festival_lineup");
    localStorage.removeItem("spotify_artists");
    localStorage.removeItem("selected_festival_name");
    setAccessToken(null);
    setRefreshToken(null);
    router.push("/");
  };

  return {
    accessToken,
    refreshToken,
    fetchWithAuth,
    logout,
  };
}
