#!/usr/bin/env bash
set -euo pipefail

# Batch export 360° spin frames: resize, compress, and rename.
# Requires: ImageMagick (brew install imagemagick)
#
# Usage: ./scripts/360-batch-export.sh <input-dir> <slug> <output-dir>
#
# Reads all image files from <input-dir> (sorted alphabetically),
# resizes to 1200x1200, exports as JPEG quality 82, and names them
# {slug}_360_{angle}.jpg where angle is 000, 010, 020, ..., 350.

if [[ $# -ne 3 ]]; then
  echo "Usage: $0 <input-dir> <slug> <output-dir>"
  echo "Example: $0 ~/captures/rolex-sub/tiff rolex-submariner ~/captures/rolex-sub/web"
  exit 1
fi

INPUT_DIR="$1"
SLUG="$2"
OUTPUT_DIR="$3"

if ! command -v magick &>/dev/null && ! command -v convert &>/dev/null; then
  echo "Error: ImageMagick is not installed."
  echo "Install with: brew install imagemagick (macOS) or sudo apt install imagemagick (Linux)"
  exit 1
fi

if command -v magick &>/dev/null; then
  CONVERT="magick"
else
  CONVERT="convert"
fi

if [[ ! -d "$INPUT_DIR" ]]; then
  echo "Error: Input directory does not exist: $INPUT_DIR"
  exit 1
fi

mkdir -p "$OUTPUT_DIR"

FILES=()
while IFS= read -r -d '' file; do
  FILES+=("$file")
done < <(find "$INPUT_DIR" -maxdepth 1 -type f \( -iname '*.jpg' -o -iname '*.jpeg' -o -iname '*.tif' -o -iname '*.tiff' -o -iname '*.png' -o -iname '*.bmp' -o -iname '*.webp' \) -print0 | sort -z)

EXPECTED=36
ACTUAL=${#FILES[@]}

if [[ $ACTUAL -eq 0 ]]; then
  echo "Error: No image files found in $INPUT_DIR"
  exit 1
fi

if [[ $ACTUAL -ne $EXPECTED ]]; then
  echo "Warning: Expected $EXPECTED files but found $ACTUAL. Proceeding anyway."
fi

echo "Processing $ACTUAL files from $INPUT_DIR → $OUTPUT_DIR"
echo "Slug: $SLUG"
echo ""

for i in "${!FILES[@]}"; do
  ANGLE=$(printf "%03d" $((i * 10)))
  OUTFILE="${OUTPUT_DIR}/${SLUG}_360_${ANGLE}.jpg"

  $CONVERT "${FILES[$i]}" \
    -resize 1200x1200^ \
    -gravity center \
    -extent 1200x1200 \
    -colorspace sRGB \
    -quality 82 \
    -strip \
    "$OUTFILE"

  SIZE=$(stat -f%z "$OUTFILE" 2>/dev/null || stat -c%s "$OUTFILE" 2>/dev/null)
  SIZE_KB=$((SIZE / 1024))
  echo "  [$((i + 1))/$ACTUAL] ${ANGLE}° → $(basename "$OUTFILE") (${SIZE_KB} KB)"
done

echo ""
echo "Done. $ACTUAL frames exported to $OUTPUT_DIR"
echo "Verify: ls -la $OUTPUT_DIR/${SLUG}_360_*.jpg | wc -l"
