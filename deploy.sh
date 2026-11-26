#!/bin/bash
# Rebuild and publish the site to https://aanuj-guptaa.github.io/agro-soil-advisor/
set -e
cd "$(dirname "$0")"
GITHUB_PAGES=true npx vite build
cp dist/index.html dist/404.html   # lets /advisor work as a direct link
touch dist/.nojekyll
cd dist && rm -rf .git && git init -q -b gh-pages && git add -A && git commit -qm "Deploy $(date '+%Y-%m-%d %H:%M')"
git push -qf https://github.com/aanuj-guptaa/agro-soil-advisor.git gh-pages && rm -rf .git
echo "Deployed. Live in ~1 minute at https://aanuj-guptaa.github.io/agro-soil-advisor/"
