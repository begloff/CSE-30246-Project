#!/usr/bin/env sh

set -e

git add --all
git commit -m "$1"
git push -u origin main

npm run build

cd dist
cp index.html 404.html

cd ..
git init
git add dist
git commit -m "New Deployment: $1"
git subtree push --prefix dist origin gh-pages