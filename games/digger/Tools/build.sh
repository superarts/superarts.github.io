#!/bin/bash

cd "$(dirname "${BASH_SOURCE[0]}")"

rm -f -r ../Build
mkdir -p ../Build/Debug
mkdir -p ../Build/Release

cp ../Source/Default.html ../Build/Debug/default.html
cp ../Source/Default.html ../Build/Release/default.html

echo Building \'Debug/digger.js\'

node tsc.js -target ES5 -out ../Build/Debug/digger.js lib.d.ts libex.d.ts ../Source/*.ts

node base64.js ../Build/Debug/digger.js Digger.Game.prototype.imageData ../Source/Sprite.png ../Source/Font.png
node base64.js ../Build/Debug/digger.js Digger.Game.prototype.soundData ../Source/Diamond.wav ../Source/Stone.wav ../Source/Step.wav

echo Building \'Release/digger.js\'

node minify.js ../Build/Debug/digger.js ../Build/Release/digger.js

echo Done.
