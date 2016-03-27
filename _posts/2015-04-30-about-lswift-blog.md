---
layout: post
title:  "About LSwift Blog"
date:   2015-04-30 16:59:06
categories: LSwift Intro Gossip
---

I decided to write something for LSwift as I keep writing new codes. One thing comes to me though, is where I should write to, and it actually caught me for a while.

I used to be a heavy wiki user. I've been using [wikidot][wikidot] for quite a while, and then I moved to [Google sites][sites], but in the recent few years I haven't really been updating them. The problem with wiki is that when it grows bigger, it takes more efforts to update, like you need to think "where page I should put this topic in" etc. So I moved to [blogspot][blog] due to the powerful tagging system, chrome extension, and most importantly I wasn't in China anymore and didn't need to worry about GFW (that's why I chose wikidot upon wikia in the first place, and by then Google was not heavily blocked as it is now).

For now, normally I'd write some random [blog posts][blog], but for some sort-of-serious tech talk, I don't think it fits there. On my blog I always talk about something I'm interested in, and I can find the right posts by choosing tags, and I don't care about how other people read them. However, when it comes to LSwift, I do hope my articles can help some people, and if I put these articles with my random posts it would easily piss people off.

Ideally, things should be put in order into project wiki, but for now I just want to write some thoughts during developing, so I decided to start a new blog and move things into wiki later (when my "lazy cancer" is cured... someday). Should I start a new blogspot site? As chance would have it, I happened to know that static website is quite popular these days (to be exactly, since 2008) and Github offers some decent support for it too, so I decided to give it a shot. Here are the advantages that make it attractive to me:

- Markdown support: I can easily write things in my terminal using Vim
- Git pages: version control, terminal update, free hosting
- Jekyll: I decided to use it since it's officially supported by Github

There can be some downsides though, for example creating a new post page can be annoying, but hopefully I've come up with some script based solution (and they will be put into this repo). Besides this, I'm still not 100% sure it's a superior solution for blogging, but it seems to be a better one for now. The plan is that this is going to be the only non-tech post. All the things I write here should be related with [LSwift][about].

[blog]:		http://superartstudio.blogspot.com
[wikidot]:	http://superart.wikidot.com/
[sites]:	https://sites.google.com/a/superarts.org/studio/
[about]:	http://superarts.github.io/LSwift/about/

About Jekyll
===
You’ll find this post in your `_posts` directory. Go ahead and edit it and re-build the site to see your changes. You can rebuild the site in many different ways, but the most common way is to run `jekyll serve --watch`, which launches a web server and auto-regenerates your site when a file is updated.

To add new posts, simply add a file in the `_posts` directory that follows the convention `YYYY-MM-DD-name-of-post.ext` and includes the necessary front matter. Take a look at the source for this post to get an idea about how it works.

Jekyll also offers powerful support for code snippets:

{% highlight ruby %}
def print_hi(name)
  puts "Hi, #{name}"
end
print_hi('Tom')
#=> prints 'Hi, Tom' to STDOUT.
{% endhighlight %}

Check out the [Jekyll docs][jekyll] for more info on how to get the most out of Jekyll. File all bugs/feature requests at [Jekyll’s GitHub repo][jekyll-gh]. If you have questions, you can ask them on [Jekyll’s dedicated Help repository][jekyll-help].

[jekyll]:      http://jekyllrb.com
[jekyll-gh]:   https://github.com/jekyll/jekyll
[jekyll-help]: https://github.com/jekyll/jekyll-help
