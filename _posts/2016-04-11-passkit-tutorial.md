---
layout: post
title:  "Yet Another Tutorial of iOS Wallet Pass"
date:   2016-04-10 16:47:00
tags:
- iOS
- Wallet
- Pass
---

# About this Post

As mentioned below, there are a bunch of good tutorials written in 2013 about `Wallet` (formally `Passbook`). If you prefer to know more things before you actually get started, it would be very helpful to read [Beginning Passbook in iOS 6](https://www.raywenderlich.com/20734/beginning-passbook-part-1). In [iOS 6 Tutorial: Supporting Passbook within Your Enterprise Systems](https://www.captechconsulting.com/blogs/ios-6-tutorial-supporting-passbook-within-your-enterprise-systems), the contents are much clearer if you just want to know the most basic concepts of `pass`. This post kind of sit in the middle, it is:

- More about the steps of doing a certain things rather than explaining what they are;
- Focusing on testing in your local environment.
- Mainly based on the official document - [Apple: Wallet Programming Guide](https://developer.apple.com/library/ios/documentation/UserExperience/Conceptual/PassKit_PG/index.html)

# CLI Example

## Create Certificate

`Certificates.p12` is password protected. You need to create your own certificate.

- Create Pass ID: `Apple Developer Member Center -> Certificates, Identifiers & Profiles -> Identifiers -> Pass Type IDs`
- Create production certificate, download, and install in `Keychain`
- Export cert and key: select both items and export as p12 file
- Create `PEM`: `openssl pkcs12 -in Certificates.p12 -out certificate.pem -nodes -clcerts -des3 -passin pass:xxxin -passout pass:xxxout`

## Edit Pass Bundle

Check console logs to debug a pass bundle.

- `./Generic.pass` bundle: from Apple's [Wallet Companion Files](https://developer.apple.com/services-account/download?path=/iOS/Wallet_Support_Materials/WalletCompanionFiles.zip)
- `./img`: `background.png` and `strip.png` are not used in `generic` pass.
- `vim Generic.pass/pass.json`
- Add your Pass ID: `"passTypeIdentifier" : "pass.com.airservice.ordering"`
- Add your Team ID: `"teamIdentifier" : "xxxxxxxx"`
- Add your web service URL: `"webServiceURL" : "https://ozj4o1hppsdq.runscope.net"`

About [RunScope](www.runscope.com): once a test bucket is setup, all the requests sending to this link will be logged. Unfortunately you can't send proper responses to update your pass, use Apple's reference server instead.

Requests to the web service URL are like these:
![RunScope](https://www.dropbox.com/s/znjc57jr5q0og7v/Screenshot%202016-04-08%2015.44.33.png?dl=0)

### iBeacon Discovery

As mentioned [here](https://developer.apple.com/library/ios/documentation/UserExperience/Conceptual/PassKit_PG/Creating.html), iBeacons info can be added to `pass.json`:

```
"beacons": [{
	"proximityUUID": "F8F589E9-C07E-58B0-AEAB-A36BE4D48FAC",
	"relevantText": "iBeacon text: You're near my store",
	"name": "iBeacon name: My Store"
}],
```

Once a device with the pass installed enters or exits a beacon region, the pass will be shown on the lock screen of the device. However, it doesn't try to get a new pass on such events, so if no related app is installed, the web service wouldn't know if these events have happened.

The pass is always visible when an iBeacon is around:
![iBeacon](https://www.dropbox.com/s/c1c359wcvz5z3tb/Screenshot%202016-04-08%2015.31.38.png?dl=1)

The pass can be viewed without unlock the device:
![Lock Screen](https://www.dropbox.com/s/dbt1h802fwl8813/Screenshot%202016-04-08%2015.34.10.png?dl=1)

## Create Pass

CLI tool `signpass` can be used to generate and sign a `.pkpass` file. A pass cannot be updated once it's generated, it can only be replaced by a new one with updated `serialNumber`.

- `./companion`: from Apple's [Wallet Companion Files](https://developer.apple.com/services-account/download?path=/iOS/Wallet_Support_Materials/WalletCompanionFiles.zip)
- Build `signpass`: `./build-signpass-cli.sh`
- Use `signpass`: `./signpass -p Generic.pass`

## Distribute Pass

- Send as email attachment: tap icon to install
- Send as URL: tap link to install - [Online test](http://airservice.github.io/ios-wallet-example/test.pkpass) on your phone

## Update Pass

Web service should response to certain calls to communicate with installed Pass.

- Register: `POST: /v1/devices/5b591996a328d11bb556d9dd24687edb/registrations/pass.com.airservice.ordering/00000001` with `pushToken`
- To inform there's an update: send an empty push notification to `pushToken`
- Update: `GET: /v1/devices/5b591996a328d11bb556d9dd24687edb/registrations/pass.com.airservice.ordering`

## Tips

- It's mentioned in the document that you can drag the Pass into iOS Simulator to debug it. However, you need to go to the home screen to do so, not in the `Wallet` app.
- I'm not sure when it's introduced but now you can also double click it in `OS X 10.11`.
- I couldn't find error messages in console as mentioned in the document, instead device log works for me. To view logs, go to `Xcode -> Window -> Devices`, select your device, and click the little triangle button on the bottom-left corner in the right view.

View pass in OS X:
![OS X Pass Viewer](https://www.dropbox.com/s/kpeeaqxfibihgpt/Screenshot%202016-04-08%2015.40.35.png?dl=1)

# Ruby Example

About creating and export certificates, editing `pass.json` etc. please refer to `CLI Example` above.

- `bundle install`
- `vim test.rb`

## Server: Sign Pass

```
require 'sign_pass'
pass_signer = SignPass.new('Generic.pass', 'Certificates.p12', 'password', 'AppleWWDRCA.cer', 'output.pkpass')
pass_signer.sign_pass!
```

## Device: Install Pass

Open [this website](http://airservice.github.io/ios-wallet-example) on iOS device and download [test.pkpass](`http://airservice.github.io/ios-wallet-example/test.pkpass`)

After user installs `output.pkpass`, a POST will be send with a push token to your `webServiceURL`:

- `POST: /v1/devices/5b591996a328d11bb556d9dd24687edb/registrations/pass.com.airservice.ordering/00000001` with `pushToken`

## Server: Send Empty APN

Once a pass has been updated, an empty APN should be sent to a device token:

```
require 'grocer'
pusher = Grocer.pusher(
  certificate: "certificate.pem",
  passphrase:  "password",
  gateway:     "gateway.push.apple.com",
  port:        2195,
  retries:     3
)
notification = Grocer::PassbookNotification.new(device_token: "device_token")
pusher.push(notification)
```

## Device: Download New Pass

- `GET: /v1/devices/5b591996a328d11bb556d9dd24687edb/registrations/pass.com.airservice.ordering`

## Device: Delete Pass

- `DELETE /v1/devices/5b591996a328d11bb556d9dd24687edb/registrations/pass.com.airservice.ordering/00000001`

# Test Server

Under `companion/ServerReference/pass_server` there's an offical test server implemented with `Ruby`. Unlike the examples above which only demostrate the most basic workflow, it covers a lot of details of the pass server. Please follow the `README.md` file to get it work.

- Add private and WWDR certificates
- Install `ruby gems`
- Set up the reference server
- Download and install the sample `pkpass`

By default the test pass wouldn't be installed because the `webServiceURL` is based on `http` instead of `https`. To enable `http` server, on your device go to `Settings -> Developer -> Allow HTTP Services`. Of course, this should only be used for test only and `https` should always be used in production.

After everything is set up, you can run `lib/pass_server_ctl -g` to change the `gate` field and then use `lib/pass_server_ctl -n` to inform the devices by sending them an empty APN. You can also change the other fields in `data/passes/sample/pass.json` and sign it manually for more notifications on lock screen / notification center: if `changeMessage` is presented in a field and it's changed, a cooresponding notification will be displayed in notification center.

All changes will be added to notification center regarding the current update:
![Changes](https://www.dropbox.com/s/j08xx5h4usi1aw3/Screenshot%202016-04-08%2015.36.45.png?dl=1)

Please refer to the log messages for details.

# Urban Airship Wallet

- Create an [Urban Airship Wallet Account](wallet.urbanairship.com)
  - [Pricing](https://www.urbanairship.com/products/engage/pricing)
- Create an iOS template
  - Generic template for `Android Pay` is coming soon
- Wallet API, including certificate upload, is not available for public at 8th of April, 2016. Hopefully it will be updated in the [official document](http://docs.urbanairship.com/api/wallet.html)

# About PassKit

Once your provisioning profile is associated with your pass type identifier(s), you'll be able to read, update, or delete related passes in your app. You don't need an entitlement to add a pass using `PKAddPassesViewController`.

```
	NSURL* url = [NSURL URLWithString:@"http://airservice.github.io/ios-wallet-example/test.pkpass"];
	NSData* data = [NSData dataWithContentsOfURL:url];
	NSError* error;
	PKPass* pass = [[PKPass alloc] initWithData:data error:&error];
	PKPassLibrary* lib = [[PKPassLibrary alloc] init];
	NSLog(@"PASS availability: %i, sample pass: %@, error: %@, contains pass: %i", [PKPassLibrary isPassLibraryAvailable], pass, error, [lib containsPass:pass]);
```

- Adding a pass: `PKAddPassesViewController* controller = [[PKAddPassesViewController alloc] initWithPass:pass];`
- Present a pass: `[[UIApplication sharedApplication] openURL:[pass passURL]];`
  - You can also display contents of the pass in your own way
- Reading all passes: `[lib passes];`
- Update pass: `[lib replacePassWithPass:pass];`
  - Your server should also send notifications to make other devices of yours stay up-to-date
- Remove pass: `[lib removePass:pass];`
  - You're not supposed to remove a pass without user interaction.