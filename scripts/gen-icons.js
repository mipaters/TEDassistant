const sharp = require("sharp");
const fs = require("fs");

const svg = fs.readFileSync("scripts/icon-master.svg");
const sizes = [16, 32, 48, 180, 192, 512];

(async () => {
  for (const size of sizes) {
    const out =
      size === 180 ? "public/icons/apple-touch-icon.png" : `public/icons/icon-${size}.png`;
    await sharp(svg, { density: 384 }).resize(size, size).png().toFile(out);
    console.log("wrote", out);
  }
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
