#!/usr/bin/env bash
set -e
cd "$(dirname "$0")"
PUBLIC=../../frontend/public
mkdir -p "$PUBLIC" frames
rm -f frames/*.png

CHROME="google-chrome-stable"
FLAGS=(--headless --disable-gpu --no-sandbox --window-size=1440,810 --virtual-time-budget=900 --hide-scrollbars)

# 1) stills
"$CHROME" "${FLAGS[@]}" --screenshot="$PUBLIC/coin.png" "file://$(pwd)/coin.html" >/dev/null 2>&1
"$CHROME" "${FLAGS[@]}" --screenshot="$PUBLIC/network.png" --window-size=1440,900 "file://$(pwd)/network.html" >/dev/null 2>&1
echo "stills done"

# 2) video frames in parallel: 12fps x 6s
FPS=12
DUR=6
N=$((FPS * DUR))
CHROME_BIN="$CHROME"
BASE="file://$(pwd)/hero/anim.html"
export CHROME_BIN BASE
seq 0 $((N - 1)) | xargs -P 6 -I{} bash -c '
  t=$(python3 -c "print({} / 12.0)")
  f=$(printf "frames/f_%03d.png" {})
  "$CHROME_BIN" --headless --disable-gpu --no-sandbox --window-size=1440,810 --virtual-time-budget=900 --hide-scrollbars --screenshot="$f" "$BASE?t=$t" >/dev/null 2>&1
'
echo "frames done ($N)"

# 3) encode
ffmpeg -y -framerate "$FPS" -i frames/f_%03d.png -c:v libx264 -pix_fmt yuv420p -crf 18 -movflags +faststart "$PUBLIC/hero.mp4" >/dev/null 2>&1
echo "video done"
ls -la "$PUBLIC/hero.mp4" "$PUBLIC/coin.png" "$PUBLIC/network.png"
