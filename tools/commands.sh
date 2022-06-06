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

# install node modules before compiling
cd ~/Smooth-Dragon
npm install

# run in development mode   (check section scripts/dev in package.json)
npm run dev

# build code optimized for production mode   (check section scripts/build in package.json). Code will be placed at dist/
# first install needed libraries 
npm install

# then build
npm run build
