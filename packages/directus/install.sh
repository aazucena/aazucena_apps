#!/bin/sh

ins() {
  dir="$1"
  echo "Building extension in $dir"
  # ls -al "$dir"
  cd "$dir" && npm i && npm run build
  echo "Build for $dir finished"
}

for dir in ./extensions/*/; do
  if [ "$dir" = "./extensions/.registry/" ]; then
    continue;
  fi;

  if [ -f "$dir/package.json" ] && [ -d "$dir/src" ]; then
    echo "$PWD"
    (ins "$dir")
  fi
done
