---
layout: post
title:  "Setting us a New Mac"
date:   2016-05-10 17:50:00
tags:
- Mac
- OS X
- git
- brew
- homebrew
---

Whenever I was setting up a new Mac once in a while, I found some of my old approaches were not ideal and wanted to find a "best" solution for the future. Although it's kind of proven impossible, I'd like to take a note of the things I've done this time. It would be great to create a bunch of scripts so that I could start from a git repo, but I'm afraid the whole process is not optimized to the best so let's just do things step by step. Here are the brief contents:

- Xcode & Dev Tools
- Dropbox
- System Settings
- Brew
- ZSH
- VIM

# Xcode

Grab the latest `Xcode` from `App Store`, or download an old version and install manually by dragging `Xcode.app` into `/Applications`.

- Login to [Apple Developer Center](https://developer.apple.com/downloads/)
- Find the version you want and download for free
- `xattr -d com.apple.quarantine /Applications/Xcode.app` if it's being verified all the time

## Command Line Tools

OS X command-line tools contain the most basic dev components including `gcc`, `make`, etc. and is required by `brew`. 

- `xcode-select --install` or download and install a previous version manually

# Dropbox

Although Dropbox can be accquired via `brew cask install dropbox`, we still need to download and install it manually since that will be our startup point, which can be either Dropbox or a private git repo (public repo is not recommended since there might be some sort of credentials inside one of your preference files). I chose Dropbox because it provides a consistant user experience for file sharing, and conflict resolving is not really a big concern in this scenario.

[Download Dropbox](https://www.dropbox.com/downloading?os=mac)

# System Settings

Unfortunately OS X system preference cannot be imported/exported easily because they are saved in [various different places](http://apple.stackexchange.com/questions/118482/is-there-any-way-to-save-mac-os-x-preferences-into-a-shell-file). So while Dropbox is syncing your files, take a time to go through all the system settings to make yourself happy.

# Shell

Shell is essential for developers like me. A nice shell environment generally means happy life.

## Homebrew

`Brew` is a source based package/dependency management system on OS X. It's not as fast to install as the binary based ones in most Linux distributions, but it's the best of its kind in OS X. It's mainly (but not only) for command-line tools, while `Cask` is based on it and is used for native OS X apps.

- [Generate brewfile and castfile](https://github.com/seethroughtrees/homebrew-dotfile-generator) from your old Mac
- [Install](http://brew.sh/): `/usr/bin/ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"`
- `sh brew/.brew`
- `brew bundle brew/Brewfile` (deprecated)
- `brew bundle brew/Caskfile` (deprecated)

## Oh-my-zsh

A nicer and faster shell. Oh-my-zsh cannot be installed via brew since it exists as a repo with plugins and themes together, other than an app with bin/lib and man pages. So just run the official install script.

- [Install](https://github.com/robbyrussell/oh-my-zsh): `sh -c "$(curl -fsSL https://raw.githubusercontent.com/robbyrussell/oh-my-zsh/master/tools/install.sh)"`
- `ln -s Dropbox/etc/sh/.zshrc .zshrc`
- `ln -s Dropbox/etc/sh/.gemrc .gemrc`
- `ln -s Dropbox/etc/sh/.xvimrc .xvimrc`
- `ln -s Dropbox/etc/sh/.bash_profile .bash_profile`
- `cd .oh-my-zsh && git pull superarts master`

## VIM

Use `vim` instead to enable features like clipboard sharing.

- `sudo mv /usr/bin/vim /usr/bin/oldvim`
- `ln -s Dropbox/etc/vim/.vimrc .vimrc`
- `ln -s Dropbox/etc/vim/.vim .vim`

# Others

- Install some "special" apps from `Dropbox/bin`
- `BetterTouchTool`
  - `Advanced Settings` -> uncheck `Enable automatic update checking`
  - `Gestures` -> `Keyboard` -> `Import` -> `Dropbox/etc/bbt`