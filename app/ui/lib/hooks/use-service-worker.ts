"use client";

import { useEffect, useRef } from "react";

export function useServiceWorker() {
  const registered = useRef(false);

  useEffect(() => {
    if (typeof window === "undefined" || !("serviceWorker" in navigator)) return;
    if (registered.current) return;
    registered.current = true;

    navigator.serviceWorker.register("/sw.js").catch((err) => {
      console.error("[sw] Registration failed:", err);
    });

    // Reload when a new SW takes over (seamless updates)
    let refreshing = false;
    const onControllerChange = () => {
      if (refreshing) return;
      refreshing = true;
      window.location.reload();
    };

    navigator.serviceWorker.addEventListener("controllerchange", onControllerChange);
    return () => {
      navigator.serviceWorker.removeEventListener("controllerchange", onControllerChange);
    };
  }, []);
}
