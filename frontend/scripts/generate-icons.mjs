import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const svgPath = path.join(root, "public", "vzgym.svg");
const iconsDir = path.join(root, "public", "icons");

const svg = fs.readFileSync(svgPath);

async function writeSquareIcon(size, filename) {
  await sharp(svg).resize(size, size).png().toFile(path.join(iconsDir, filename));
}

fs.mkdirSync(iconsDir, { recursive: true });

await writeSquareIcon(192, "icon-192.png");
await writeSquareIcon(512, "icon-512.png");
await writeSquareIcon(180, "../apple-touch-icon.png");

console.log("Ícones PWA gerados em public/icons/");
