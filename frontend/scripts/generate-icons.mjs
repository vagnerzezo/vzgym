import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const logoPath = path.join(root, "public", "logo.png");
const iconsDir = path.join(root, "public", "icons");
const appDir = path.join(root, "src", "app");

const BG = "#1f1e19";
const PLATE = "#ffffff";

/**
 * App icon: dark square + white circular plate + black logo.
 * Opaque RGB (no alpha) — required for reliable iOS home-screen icons.
 */
async function renderIcon(size) {
  const plateMargin = Math.round(size * 0.06);
  const plateSize = size - plateMargin * 2;
  const logoMax = Math.round(size * 0.72);

  const circle = Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}">
      <rect width="${size}" height="${size}" fill="${BG}"/>
      <circle cx="${size / 2}" cy="${size / 2}" r="${plateSize / 2}" fill="${PLATE}"/>
    </svg>`,
  );

  const logo = await sharp(logoPath)
    .ensureAlpha()
    .resize(logoMax, logoMax, {
      fit: "contain",
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    })
    .png()
    .toBuffer();

  const logoMeta = await sharp(logo).metadata();
  const left = Math.round((size - (logoMeta.width ?? logoMax)) / 2);
  const top = Math.round((size - (logoMeta.height ?? logoMax)) / 2);

  return sharp(circle)
    .composite([{ input: logo, left, top }])
    .flatten({ background: BG })
    .png({ palette: false })
    .toBuffer();
}

async function writePng(size, dest) {
  const buf = await renderIcon(size);
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.writeFileSync(dest, buf);
}

function writeIco(dest, images) {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(images.length, 4);

  const parts = [header];
  let offset = 6 + images.length * 16;
  const entryBufs = [];
  for (const img of images) {
    const entry = Buffer.alloc(16);
    entry.writeUInt8(img.size >= 256 ? 0 : img.size, 0);
    entry.writeUInt8(img.size >= 256 ? 0 : img.size, 1);
    entry.writeUInt8(0, 2);
    entry.writeUInt8(0, 3);
    entry.writeUInt16LE(1, 4);
    entry.writeUInt16LE(32, 6);
    entry.writeUInt32LE(img.data.length, 8);
    entry.writeUInt32LE(offset, 12);
    entryBufs.push(entry);
    offset += img.data.length;
  }
  parts.push(...entryBufs, ...images.map((img) => img.data));
  fs.writeFileSync(dest, Buffer.concat(parts));
}

fs.mkdirSync(iconsDir, { recursive: true });

await writePng(192, path.join(iconsDir, "icon-192.png"));
await writePng(512, path.join(iconsDir, "icon-512.png"));
await writePng(180, path.join(root, "public", "apple-touch-icon.png"));
await writePng(180, path.join(root, "public", "apple-touch-icon-180x180.png"));
await writePng(180, path.join(appDir, "apple-icon.png"));
await writePng(32, path.join(appDir, "icon.png"));

const png32 = await renderIcon(32);
const png16 = await sharp(png32).resize(16, 16).png().toBuffer();
writeIco(path.join(appDir, "favicon.ico"), [
  { size: 16, data: png16 },
  { size: 32, data: png32 },
]);

console.log("Ícones PWA gerados (badge branco opaco + logo).");
