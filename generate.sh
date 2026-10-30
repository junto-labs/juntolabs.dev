#!/usr/bin/env bash
# Regenerates the go-import pages in site/ from modules.txt.
set -euo pipefail
cd "$(dirname "$0")"

domain=juntolabs.dev
out=site

page() { # page <import path> <module> <repo>
  local path=$1 module=$2 repo=$3
  mkdir -p "$out/$path"
  cat > "$out/$path/index.html" <<HTML
<!doctype html>
<html>
<head>
<meta charset="utf-8">
<meta name="go-import" content="$domain/$module git $repo">
<meta name="go-source" content="$domain/$module $repo $repo/tree/main{/dir} $repo/blob/main{/dir}/{file}#L{line}">
<meta http-equiv="refresh" content="0; url=$repo">
<title>$domain/$path</title>
</head>
<body><a href="$repo">$repo</a></body>
</html>
HTML
}

find "$out" -mindepth 1 -maxdepth 1 -type d -exec rm -rf {} +
while read -r module repo dirs; do
  [[ -z $module || $module == \#* ]] && continue
  page "$module" "$module" "$repo"
  for dir in $dirs; do
    # Every prefix gets a page, so Go's module lookup never hits a 404.
    prefix=$module
    IFS=/ read -ra parts <<< "$dir"
    for part in "${parts[@]}"; do
      prefix=$prefix/$part
      page "$prefix" "$module" "$repo"
    done
  done
done < modules.txt
