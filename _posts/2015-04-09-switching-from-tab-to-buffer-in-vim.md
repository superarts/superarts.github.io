---
layout: post
title:  Switching from Tab to Buffer in VIM
date:   2015-04-09 17:25:00
tags:
- VIM
---

When I started using `VIM` I didn't realize that `tabs` were supposed to be used as different window layouts, and `buffer` serves the role for multiple file editing / switching between each other. Actually in the beginning tabs are not even there before v7.0 and I just opened one VIM inside a terminal tab (I was using gnome-terminal at the moment), and switch between tabs using alt+numbers, since I thought using commands like `:buffers`, `:bn` and `:bp` were too much for me. When VIM 7.0 was released I find it's easier to manager a lot of files and switched to it, but recently I just realized that buffers should always be the way to go, with one thing in mind: you need to configure it to make it works right. That should be the spirit of vim anyway.

So I tried vim-airline and enabled the visual on-top tab-like buffer bar, but graphic was having problem with my iTerm2, so I tried a couple of others and it seems that MBE works the best for me. I also set shift+h/l as shortcuts, since the original ones (moving to the head/tail of the current page) are not very useful to me.

{% highlight vim %}
map <S-h> :bprev<Return>
map <S-l> :bnext<Return>
{% endhighlight %}

It seems to be even easier than `gt` and `gT`, and `:e` is easier to type than `:tabnew` too. I find `:bd` is not as convenient as `:q` though (MBE is having some problem with it) but I can live with all files in buffer I think. Glad to learn new tricks when I'm getting old :D

PS: how to get vim with +clipboard: `brew install vim | sudo mv /usr/bin/vim /usr/bin/oldvim`
