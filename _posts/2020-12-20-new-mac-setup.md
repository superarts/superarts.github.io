---
layout: post
title:  "Setting up a New Mac in 2020"
date:   2020-12-20 12:00:00
tags:
- Mac
- macOS
- git
- brew
- homebrew
---

Since I wrote [Setting up a New Mac](/blog/2016/05/10/setting-up-os-x-in-a-new-mac) back in 2016, a lot of things have been changed. Even though I haven't moved to an ARM based Mac yet, I'm still amending my previous post for my future reference.

# Setting up a New Mac in 2020

- Xcode & Dev Tools
- Dropbox - replaced by mega.nz
- System Settings
- Brew
- ZSH
- VIM

## Things I've learned in 2020

- Don't try to save money from hardware. The more money you save, the more time you are going to consume to accomplish the same task. I've moved from 1TB hybrid drive, to 128GB SSD + HDD, and now to an external 1TB SSD. Dealing with disk space issue is no fun.
- Don't restore from another Mac or a Time machine backup if you are a developer. We usually deploy workarounds in our system and it's good to start anew when we get some new hardware. Time machine is only good to recover from a hardware cataclysm.

## Xcode

Update: Xcode should still be the first thing I install for my new OS. The following still applies.

Grab the latest `Xcode` from `App Store`, or download an old version and install manually by dragging `Xcode.app` into `/Applications`.

- Login to [Apple Developer Center](https://developer.apple.com/downloads/)
- Find the version you want and download for free
- `xattr -d com.apple.quarantine /Applications/Xcode.app` if it's being verified all the time

### Command Line Tools

OS X command-line tools contain the most basic dev components including `gcc`, `make`, etc. and is required by `brew`. 

- `xcode-select --install` or download and install a previous version manually

### XVIM2

VIM for Xcode is a must for me: [XVIM2](https://github.com/XVimProject/XVim2). [Resigning](https://github.com/XVimProject/XVim2/blob/master/SIGNING_Xcode.md) can take a lot of time.

## Mega.nz

I replaced Dropbox with [mega.nz](https://mega.nz/sync) mainly because the new device restriction Dropbox installed. I plan to use multiple cloud storages for different purposes in future.

I have 2 cloud folders under root: `mega` for system settings and important documents, and `data` for anything else. If root drive is too small for the whole cloud drive, `mega` will be used instead.

## System Settings

Unfortunately macOS system preference cannot be imported/exported easily because they are saved in [various different places](http://apple.stackexchange.com/questions/118482/is-there-any-way-to-save-mac-os-x-preferences-into-a-shell-file). So while mega is syncing your files, take a time to go through all the system settings to make yourself happy.

## Shell

Shell is essential for developers like me. A nice shell environment generally means happy life.

### Homebrew

`Brew` is a source based package/dependency management system on macOS. Now it supports binary dependencies, and `Cask` is supported natively.

- [Install](http://brew.sh/): `/usr/bin/ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"`
- `sh mega/etc/brew/.brew`

However, I try to avoid Cask now, as I put most applications in a smaller portable SSD, except for something that cannot be installed outside `/Applications` like `mega.nz` and `Logitech G Hub`.

### Oh-my-zsh

A nicer and faster shell. Oh-my-zsh cannot be installed via brew since it exists as a repo with plugins and themes together, other than an app with bin/lib and man pages. So just run the official install script.

- [Install](https://github.com/robbyrussell/oh-my-zsh): `sh -c "$(curl -fsSL https://raw.githubusercontent.com/robbyrussell/oh-my-zsh/master/tools/install.sh)"`
- `ln -s mega/etc/sh/zshrc .zshrc`
- `ln -s mega/etc/sh/gemrc .gemrc`
- `ln -s mega/etc/sh/bash_profile .bash_profile`
- `cd .oh-my-zsh && git pull superarts master`

### VIM

We don't have to Use `vim` from `brew` instead to enable features like clipboard sharing anymore. So the first step is not needed.

- `sudo mv /usr/bin/vim /usr/bin/oldvim` (deprecated)
- `ln -s Dropbox/etc/vim/vimrc .vimrc`
- `ln -s Dropbox/etc/vim/xvimrc .xvimrc`
- `ln -s Dropbox/etc/vim/vim .vim`
