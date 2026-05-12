import { useEffect, useState, useRef } from "react";

type FoodItem = {
  id: number;
  name: string;
  description: string | null;
  price: number;
  category?: string | null;
  available: boolean;
  imageUrl?: string | null;
  rating?: number;
};

type UseRealtimeFoodOptions = {
  includeUnavailable?: boolean;
  pollIntervalMs?: number;
};

/**
 * Custom hook for real-time food menu updates
 * Polls the food API at regular intervals and syncs state with server
 * More efficient than full page refresh
 */
export function useRealtimeFood(
  initialFoods: FoodItem[],
  options: UseRealtimeFoodOptions = {}
) {
  const { includeUnavailable = false, pollIntervalMs = 3000 } = options;
  const [foods, setFoods] = useState<FoodItem[]>(initialFoods);
  const [isLoading, setIsLoading] = useState(false);
  const lastFetchRef = useRef<number>(0);
  const pollIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const fetchFoods = async (forceUpdate = false) => {
    try {
      // Avoid too frequent API calls
      const now = Date.now();
      if (!forceUpdate && now - lastFetchRef.current < 1000) {
        return;
      }

      setIsLoading(true);
      const params = includeUnavailable ? "?includeUnavailable=1" : "";
      const res = await fetch(`/api/food${params}`, {
        cache: "no-store",
        headers: {
          "Cache-Control": "no-cache",
        },
      });

      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) {
          setFoods(data);
          lastFetchRef.current = now;
        }
      }
    } catch (err) {
      console.error("Error fetching foods:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Set up polling
  useEffect(() => {
    // Initial fetch
    fetchFoods(true);

    // Set up interval for polling
    pollIntervalRef.current = setInterval(() => {
      fetchFoods();
    }, pollIntervalMs);

    return () => {
      if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current);
      }
    };
  }, [pollIntervalMs, includeUnavailable]);

  // Manual refresh function
  const refreshFoods = () => fetchFoods(true);

  return { foods, isLoading, refreshFoods };
}
