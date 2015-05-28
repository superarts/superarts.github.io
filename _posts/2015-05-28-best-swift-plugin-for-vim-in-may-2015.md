---
layout: post
title:  Best Swift Plugin for VIM Til' May 2015
date:   2015-05-28 12:59:00
tags: VIM Swift Xcode iTerm
---

The good thing with [XVim](https://github.com/XVimProject/XVim) is that you get `VIM` key binding in your `Xcode`, and don't need to worry about syntax color, indentation, auto completion, etc. However, VIM in `iTerm` is still the best editor for me for various reasons. I'm not going to list all of them because it's pointless: I'm not trying to convince anyone that VIM in terminal is better since everyone has his own opinion. For me I always enjoy a fully functional shell environment with text editors that comes to me when I hit a simple hotkey `F1`, which beats the crap out of `Microsoft Windows` and its powerless `PowerShell`. But anyway, since I almost moved to `Swift` completely since last year, a `Swift` file-type plugin is essencial for my work.

I've been using Toyamarinyon's [vim-swift](https://github.com/toyamarinyon/vim-swift). It's a very basic file-type plugin with very limited syntax highlight, in which the function parameters never look right, and simply uses `cindent` for indenting, which results an additional tab when a semicolon is missing at the end of the line, but comparing with Keith's [swift.vim](https://github.com/keith/swift.vim), at least the closing curly bracket is correctly unindented. Today it came to my mind and I decided to check what's new in the scene, so I took a look and it appears that `vim-swift` has not been updated at all, and `swift.vim` still has the terrible problem with closing bracket. Luckily, Kballard's [vim-swift](https://github.com/kballard/vim-swift) appears at the top of Google search this time, and it looks quite promising at the first glance. Although the syntax highlight doesn't look fancy, indentation seems to be much better with this plugin, so I'd like to give it a shot.

As stated `vim-swift` doesn't work well with `set showmatch`, but someone also mentioned that `showparent` is actually a better solution than `showmatch`. It seems to be nice too and in my case the `vimrc` syntax is:

{% highlight vim %}
hi MatchParen cterm=none ctermbg=green ctermfg=white
{% endhighlight %}

BTW I now put `~/.vimrc` and `~/.vim` into my `Dropbox` folder, and created `symbolic link` of them so that whenever I make changes, it automatically appears in other computers of mine as well. `Hard linke` doesn't work every well with `Dropbox` in this case.
