#!/bin/bash
# Downloads the original site's photos, videos and music into public/assets.
# Run once:  npm run assets      (replace them with your own any time after)
cd "$(dirname "$0")/.."
BASE="https://ribbon-kohl.vercel.app"
FILES=(
  assets/images/background.jpg
  assets/images/couple/groom.jpg
  assets/images/couple/bride.jpg
  assets/images/couple/couple-1.jpg
  assets/images/couple/couple-2.jpg
  assets/images/events/haldi.jpg
  assets/images/events/sangeet.jpg
  assets/images/events/wedding.jpg
  assets/images/events/reception.jpg
  assets/images/events/originals/haldi.png
  assets/images/events/originals/sangeet.png
  assets/images/events/originals/wedding.png
  assets/images/events/originals/reception.png
  assets/videos/intro.mp4
  assets/videos/hero-background.mp4
  assets/music/background-music.mp3
)
fail=0
for f in "${FILES[@]}"; do
  out="public/$f"
  mkdir -p "$(dirname "$out")"
  if [ -s "$out" ]; then echo "  • $f (already there)"; continue; fi
  if curl -fsSL -o "$out" "$BASE/$f"; then echo "  ✓ $f"; else echo "  ✗ $f"; rm -f "$out"; fail=1; fi
done
[ $fail -eq 0 ] && echo "All media downloaded." || { echo "Some files failed — check your connection and run again."; exit 1; }
