#!/bin/sh
set -eu
outdir=/out
mkdir -p "$outdir"
for f in /imgs/IMG_*.PNG; do
  base=$(basename "$f" .PNG)
  echo "===== $base ====="
  tesseract "$f" "$outdir/$base" -l eng --psm 6 >/dev/null 2>&1 || true
  if [ -f "$outdir/$base.txt" ]; then
    head -n 40 "$outdir/$base.txt"
  fi
  echo
done
