"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

type RouteAutoRefreshProps = {
  intervalMs?: number;
};

export default function RouteAutoRefresh({
  intervalMs = 10000,
}: RouteAutoRefreshProps) {
  const router = useRouter();

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      router.refresh();
    }, intervalMs);

    return () => window.clearInterval(intervalId);
  }, [intervalMs, router]);

  return null;
}