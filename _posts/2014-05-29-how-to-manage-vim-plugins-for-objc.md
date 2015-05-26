---
layout: post
title:  How to Manage VIM Plugins for Objective C
date:   2014-05-29 15:38:00
tags:
- VIM
- Objective C
- Pathogen
---

It doesn't seems that a lot of iOS developers are using VIM, so there aren't many resource there. I've been using cocoa.vim for ages and it hasn't been updated for 4 years, while a lot of new features are introduced like ARC, block, etc. In this way you can make things well organized:

{% highlight sh %}
~/.vim$ ls autoload/
pathogen.vim
~/.vim$ ls bundle/
cocoa.vim vim-objc
{% endhighlight %}

Search keywords for the repos on github. Also don't forget to add this to your .vimrc:

execute pathogen#infect()

PS: cocoa.vim - https://github.com/msanders/cocoa.vim
