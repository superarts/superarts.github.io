---
layout: post
title:  Misleading Debug Message Regarding Swift Closure
date:   2015-06-09 14:07:00
tags: Swift Xcode Closure Debug
---

While Apple announced `Swift 2.0`, it's also going to [make it open source](https://developer.apple.com/swift/blog/?id=29) which is a really good news. However we're still going to build products with the tools we currently have. In `Swift` 1.2 with `Xcode` 6.3.2, you may find debugging with closure is weird sometimes. For example, when I was trying to add [MHVideoPhotoGallery](https://github.com/mariohahn/MHVideoPhotoGallery) into my project, I got some problem with the following code:

{% highlight swift %}
gallery.finishedCallback = {
	(index:Int, image:UIImage!, transition:MHTransitionDismissMHGallery!, mode:MHGalleryViewMode) -> Void in
	gallery.dismissViewControllerAnimated(true, dismissImageView:self.image_complaint.image, completion:nil)
}
{% endhighlight %}

The error message `cannot assign a value of type '(Int, UIImage!, MHTransitionDismissMHGallery!, MHGalleryViewMode) -> Void' to a value of type '((Int, UIImage!, MHTransitionDismissMHGallery!, MHGalleryViewMode) -> Void)!'` doesn't help a lot and it appears in a misleading way, which makes it looks like it's saying that there's some problem with the closure parameters. But actually the real meaning is that `there's some problem in the closure so that we cannot make it a proper non-nullable closure as it should be`, and obviously, it doesn't help at all. Instead the problem in the closure should be addressed. If you change the code a little bit like this:

{% highlight swift %}
let block = {
	(index:Int, image:UIImage!, transition:MHTransitionDismissMHGallery!, mode:MHGalleryViewMode) -> Void in
	gallery.dismissViewControllerAnimated(true, dismissImageView:self.image_complaint.image, completion:nil)
}
gallery.finishedCallback = block
{% endhighlight %}

Now we got the real problem: `'UIImage' is not convertible to 'UIImageView'`, and yes, I wrongly typed `image_complaint.image` instead of `image_complaint`. After I fixed the typo it looked like:

{% highlight swift %}
let block = {
	(index:Int, image:UIImage!, transition:MHTransitionDismissMHGallery!, mode:MHGalleryViewMode) -> Void in
	gallery.dismissViewControllerAnimated(true, dismissImageView:self.image_complaint, completion:nil)
}
gallery.finishedCallback = block
{% endhighlight %}

Which works in the same way as the following version, as it should do:

{% highlight swift %}
gallery.finishedCallback = {
	(index, image, transition, mode) -> Void in
	gallery.dismissViewControllerAnimated(true, dismissImageView:self.image_complaint, completion:nil)
}
{% endhighlight %}

I'm pretty sure Apple will address this issue in a future release, but for now if you're debuggin with closure, you can use the work-around described above to find the problem more easily.
