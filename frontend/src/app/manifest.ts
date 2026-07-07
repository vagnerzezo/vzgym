import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "vzgym — Ficha de Treino",
    short_name: "vzgym",
    description: "Gerenciador de fichas de treino de academia",
    start_url: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#09215f",
    theme_color: "#09215f",
    icons: [
      {
        src: "/icons/icon-192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icons/icon-512.png",
        sizes: "512x512",
        type: "image/png",
      },
      {
        src: "/icons/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
