"use client";

import { useEffect } from "react";

export function PWARegister() {
  useEffect(() => {
    if (!("serviceWorker" in navigator)) return;

    if (process.env.NODE_ENV !== "production") {
      navigator.serviceWorker.getRegistrations().then((registrations) =>
        Promise.all(registrations.map((registration) => registration.unregister())),
      );

      caches.keys().then((keys) =>
        Promise.all(
          keys
            .filter((key) => key.startsWith("vzgym-"))
            .map((key) => caches.delete(key)),
        ),
      );
      return;
    }

    navigator.serviceWorker.register("/sw.js").catch((err) => {
      console.warn("[PWA] Falha ao registrar service worker:", err);
    });
  }, []);

  return null;
}
