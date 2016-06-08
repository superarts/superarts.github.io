---
layout: post
title:  Getting SIM Number on iPhone 
date:   2008-07-07 18:02:00
tags:
- iOS
- Toolchain
---

# [Getting Cell / Mobile Number on iPhone](http://superart.wikidot.com/chinese:iphone-how-to-get-phone-number)

`extern NSString *CTSettingCopyMyPhoneNumber();` which is available in `CoreTelephhony`. Toolchain only.

# [iPhone Video Player Sample Code](http://superart.wikidot.com/chinese:iphone-video-player)

```
//	main.m:

int main(int argc, char *argv[])
{
	NSAutoreleasePool *pool = [[NSAutoreleasePool alloc] init];
	int ret = UIApplicationMain(argc, argv, [SimpleMoviePlayerApp class]);
	[pool release];
	return ret;
}

//	SimpleMoviePlayer.h:

#import <UIKit/UIKit.h>
#import <GraphicsServices/GraphicsServices.h>
#import <MoviePlayerUI/UIEventObservableWindow.h>
#import <MoviePlayerUI/UIMovieView.h>
#import <MoviePlayerUI/UIMoviePlayerController.h>

@interface SimpleMoviePlayerApp : UIApplication
{

	UIEventObservableWindow *mainWindow;
	UIMoviePlayerController *playerController;
}
@end

//	SimpleMoviePlayer.m

#import "SimpleMoviePlayerApp.h"

@implementation SimpleMoviePlayerApp

- (void)applicationDidFinishLaunching:(GSEventRef)event;
{

	struct CGRect mainFrame = CGRectMake(0,0,320,480);
	mainWindow = [[UIEventObservableWindow alloc] initWithContentRect:mainFrame];
	playerController = [[UIMoviePlayerController alloc] initWithPlayerSize:[UIHardware mainScreenSize] isFullScreen:YES];
	[[playerController playerView] setCanShowControlsOverlay:YES];
	[playerController setControlsOverlayVisible:YES disableAutohide:NO animate: YES];
	[playerController setAutoPlayWhenLikelyToKeepUp:YES];
	[playerController setDelegate:self];
	[playerController prepareAndSetupUI];
	[[playerController movieView] setMovieWithPath:@"http://192.168.0.2/video.m4v"];
	[mainWindow setContentView:[playerController playerView]];
	[mainWindow orderFront:self];
}

- (void)moviePlayerDidFinishPlayback: (UIMoviePlayerController *)player userExited: (BOOL)userExited
{
	NSLog(@"player normal exit");
	[self terminateWithSuccess];
}

- (void)applicationWillTerminate;
{
	NSLog(@"app normal exit");
	[playerController release];
	[mainWindow release];
}

@end
```