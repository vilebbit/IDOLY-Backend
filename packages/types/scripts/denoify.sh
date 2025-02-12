#!/usr/bin/env bash
set -eu

shopt -s globstar
rm -rf denodist/
mkdir -p denodist/
cp ./*.ts denodist
cp jsr.json README.md denodist
sed -i -E "s/from '\.\/(.+)'/from '.\/\\1.ts'/g" denodist/*.ts
echo "Done! Please point Deno to denodist/"
