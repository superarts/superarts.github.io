@echo off

pushd %~dp0

rd /s /q ..\Build
md ..\Build\Debug
md ..\Build\Release

copy ..\Source\Default.html ..\Build\Debug\default.html
copy ..\Source\Default.html ..\Build\Release\default.html

echo Building 'Debug/digger.js'

set Source=
for %%i in ("../Source/*.ts") do call set Source=%%Source%% ../Source/%%i
node tsc.js -target ES5 -out ..\Build\Debug\digger.js lib.d.ts libex.d.ts %Source%

node base64.js ../Build/Debug/digger.js Digger.Game.prototype.imageData ../Source/Sprite.png ../Source/Font.png
node base64.js ../Build/Debug/digger.js Digger.Game.prototype.soundData ../Source/Diamond.wav ../Source/Stone.wav ../Source/Step.wav

echo Building 'Release/digger.js'

node minify.js ../Build/Debug/digger.js ../Build/Release/digger.js

popd

echo Done.
