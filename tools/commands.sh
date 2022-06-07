#!/bin/bash

## git commands quick reference

# convert CRLF to LF but not in the other way
git config --global core.autocrlf input

# there is an error with npm7 or higher: downgrade to npm6
sudo npm install -g npm@6

# force clean npm cache
cd ~/Smooth-Dragon
npm cache clean -f

# remove installed node modules
cd ~/Smooth-Dragon
rm -rf node_modules/

# install node-modules reflected into the package.json needed for before compiling this
cd ~/Smooth-Dragon
npm install

# run in development mode   (check section scripts/dev in package.json)
npm run dev

# build optimized code for production   (check section scripts/build in package.json). Code will be placed at ./dist/ folder
npm run build

# run code of production with simulated-server
:'
you need vscode plugin "live server"
then open "dist/index.html" in vscode and press "Go-live" button on the bottom panel
'