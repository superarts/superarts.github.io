---
layout: post
title:  Introducing Dependency Injection
date:   2017-09-17 12:00:00
tags:
- iOS
- Swinject
---

# Introducing Dependency Injection

## Introduction

[The SOLID principles](https://en.wikipedia.org/wiki/SOLID_%28object-oriented_design%29) play a big part in modern software engineering. These concepts are fairly straightforward, but when it comes to actual architecturing and coding, a bit tutorial is still nice to help start applying those principles to your projects. This tutorial is focusing on the last one of the SOLID principles: Dependency Inversion Principle.

Wait... Do we have to start with theory first? Well not really, let's take a look at a simple example.

### Starting with an example: Profile with Address

Suppose we have a `Profile` class, which contains an `Address` class as one of its properties. Suppose we want to show a human friendly `displayAddress` of a `Profile`. Considering the following design:

	class Address {
		public var street: String!
		public var city: String!
		public var state: String!
	}

	class Profile {
		public var address: Address!
		public var displayAddress: String {
			return address.street + " " + address.city + " " + address.state
		}
	}

It works for now, no doubt, but what if one day we are going to support foreign addresses? In Singapore there is no such thing as "state", and in China there is one more "district" level under "city". So if our business logic expands in future, both `Address` and `Profile` are very likely to be changed. Is there anything wrong with this design?

### Let's quickly review the Dependency Inversion Princinple

The Dependency Inversion Principle (DIP) reads:

1. High level modules should not depend upon low level modules. Both should depend upon abstractions.
2. Abstractions should not depend upon details. Details should depend upon abstractions.

[High level? Low level? What's the meaning of these?](/assets/images/blog/image001)

Please note that in DIP, "high level modules" doesn't necessarily mean that it's more abstract than "low level modules". It simply states that the implementation of "high level modules" relie on "low level modules", so you can also call them "clients" and "services", as clients need services to perform certain tasks.

In our example, high level `Profile` requires `Address` to store and display an address. To be specific, it depends on properties `street`, `city`, and `state` of a low level module `Address`, and with this design, it's very hard to make changes. The problem is that we considered implementation too much, and the question we should think through is: what is our business rule, And how should we describe it?

### Figuring out business rules

[What? Business Rules?](/assets/images/blog/image002)

What we really want here is a `String` based on `Address` for display purpose. Instead of `class`, it is a better idea to use interface to describe business rules, i.e. `protocol` in `Swift`:

	protocol Address {
		var displayAddress: String! { get }
	}

Now `Address` is abstract, and our `Profile` does not care about the implementation of `displayAddress` anymore:

	class Profile {
		public var address: Address!
		public var displayAddress: String! {
			return address.displayAddress
		}
	}

And instead of `Address`, a more specific `USAddress` implements all the details like `street`, `city`, `state`, etc.

	class USAddress: Address {
		private var street: String!
		private var city: String!
		private var state: String!
		var displayAddress: String! {
			return street + " " + city + " " + state
		}
	}

As you can see, by applying DIP, our code is much easier to maintain in future: we can either create new high level modules, like an `AddressValidator`; or low level elements, like `SingaporeAddress` or `ChinaAddress`, all depend on `protocol Address`.

### What is Dependency Inversion and Inversion of Control

You may also have heard of terms like Inversion of Control (IoC), Creation Inversion and so on, and wondered what is the relationship between them and DIP. So let's have a little theory session here.

[Why "inversion"?](/assets/images/blog/image003)

The word Dependency "Inversion" indicates that in traditional software design, high level modules tend to depend on low level modules; less code in this way, for sure, but more pain when business requirements are changed, since you will have to modify both high level and low level modules, as we can see in the example above.

And what about IoC vs DIP? IoC, as a method, is the way to achieve DIP, as a principle, by inversing control. There are multiple ways to implement IoC:

- Interface Inversion: inverseing interfaces
- Flow Inversion: inverseing flow of control
- Creation Inversion: creating objects outside of the classes they are being used in
  - Factory Pattern
  - Service Locator
  - Dependency Injection

Creation Inversion is highly used in modern software engineering. Perhaps you have used Factory Pattern or Service Locator before: objects can be created from class factories or a service locator. Dependency Injection (DI) is also one kind of creation inversion.

### Dependency Injection is an important implementation

All those methods mentioned above allow you to invert the control, i.e. implement IoC. And in this article we will be focusing on DI, an important implementation of IoC.

The word Dependency "Injection" means that low level modules are "injected" into high level modules. Consider our `Address` for example: `Profile` does not build `USAddress`, nor tries to locate any. Instead, we will use something like `profile.address = USAddress()` to inject `USAddress` into `Profile` as an `Address`.

[I feel like I'm a DI expert now!](/assets/images/blog/image004)

That's good! And there are a bunch of tricks to help achieve DI. Let's take a look at our sample project.

## Basic example of DI

Firstly please clone project from [GitHub](https://github.com/superarts/InjectionClub), and open `InjectionClub.xcworkspace` with `Xcode`. Take a brief reading at README, run the project, and play around with it to see how it works.

[Screenshot: app screen](/assets/images/blog/image005)

Doesn't do much, huh? Well the reason is that...

### Oh no! Another project without design and backend ready

In an ideal world, software development happens in streamline: product manager gathers requirements from client, UX builds wireframes. Once approved, based on UI design and back-end API, we mobile developers will be building apps undisturbed. Hmm, another peaceful day.

[I can sleep safe and sound](/assets/images/blog/image006)

...Until you wake up from daydreaming and face another project with minimium requirements, no design and back-end API at all, and a more-strict-than-ever deadline.

### System design: Avatar and User as its author

For now, the only thing you know is that you are going to build some community app with some sort of user system that supports avatar. Nothing else. You believe the only thing you can do at this phase is to write some model classes and wait for more details, but what if I would tell you, it is possible to start writing tests at this stage, based on very basic business rules?

So far the requirements we have include:

- Avatars and Users have non-negative unique IDs
- Avatars and Users are powered by back-end API for their creation
- Avatars and Users can be queried by IDs
- An Avatar must have an author

### Creating Protocols as interfaces

It's still debatable whether interfaces or tests should come first. Tests should be built based on business rules, but without interfaces business rules cannot really be defined. I tend to think they are kind of like chicken and egg - you can't really separate "what to do" and "what to test" apart in your thought process in the very beginning. In this tutorial I'll start with protocols, but it is totally fine to start writing tests first, and then conclude interfaces base on the tests.

[Screenshot: protocols](/assets/images/blog/image007)

In the `Protocols` folder, we defined the following protocols, based on the business requirements mentioned above. Firstly we create `protocl Indexable` so that:

- An `Indexable` object shall have a unique ID `uid`
- An `Indexable` object is valid if `uid` is 0 or positive

	protocol Indexable {
	  var uid: Int { get set }
	  func isValid() -> Bool
	}

	extension Indexable {
	  func isValid() -> Bool {
		return uid >= 0
	  }
	}

With [protocol extension](https://developer.apple.com/library/content/documentation/Swift/Conceptual/Swift_Programming_Language/Protocols.html#//apple_ref/doc/uid/TP40014097-CH25-ID521) we provide default implementation for function `isValid()`.

The next protocol we come up with is `Presentable` so that:

- `Presentable` objects are `Indexable`
- `Presentable` objects can be `created` asynchronously with an optional `ErrorClosure` callback
- `Presentable` objects can be `queried` via `uid`

	protocol Presentable: Indexable {
	  func create(completion: ErrorClosure?)
	  func query(uid: Int)
	}

	extension Presentable {
	  func create(completion: ErrorClosure? = nil) {
		create(completion: completion)
	  }
	}

Although the server is not ready, we design it in a way that `create` posts a `Presentable` object to server asynchronously, and a callback closure will be called once the object is created remotely. We also assume that a local database will be maintained by some background service to make it's synced with the remote database, so that `query` returns a `Presentable` object with a given `uid` from local database immediately.

Finally we define the actual `Avatar` and `user` protocols, assuming that:

- Both `Avatar` and `User` are `Presentable`
- `Avatar` must have `User` as its `author`

	protocol Avatar: Presentable {
	  var imageURL: String { get set }
	  var author: User! { get set }
	  init()
	  init(author: User)
	}

	protocol User: Presentable, CustomStringConvertible {
	  var username: String! { get set }

	  init()
	  init(username: String)
	}

For either `Avatar` or `User`, there will be 2 use cases. To create a new object, `init` with parameter `author` or `username` creates a local object, and once `create(completion:)` is called, a `uid` will be assigned to the object so that it becomes valid. To query an existing object, `init()` creates a "placeholder" object, and after `query(uid:)` the contents of the object will be reloaded.

### Writing tests

[Screenshot: tests](/assets/images/blog/image008)

There are several test classes in the project, and since no DI framework has been introduced yet, let's start with `NewUserAndAvatarWithoutSwinjectTests`, which is about creating new instances of `Avatar` and `User`. Suppose we're starting with a `newUser` and a `newAvatar`, and `newUser` will be the `author` of `newAvatar`:

	  var newUser: User!
	  var newAvatar: Avatar!

In `setUp()`, we would like to initialize local objects first, then call `create(completion:)` to actually create the objects asynchronously. For obvious reason `newUser` should be initialzed before `newAvatar`. The steps would be:

1. Initialize `newUser` with `username`;
2. Initialize `newAvatar` with `newUser` as `author`;
3. Create `newAvatar`;
4. Create `newUser`.

	  override func setUp() {
		super.setUp()
		//	newUser = User(username: "Ned Stark")
		//	newAvatar = Avatar(author: newUser)
		newAvatar.create(completion: { error in
		  self.newUser.create(completion: { error in
			exp.fulfill()
		  })
		})
	  }

While initialzing `Avatar` with `author: newUser`, we are injecting dependency `User` to `Avatar`. `Avatar` does not depend on the implementation of `User` at all: due to lack of back-end support, we are not able to provide an actual `User` yet. However, it doesn't stop us from writing the setup processes above, and wouldn't stop us from writing test cases either.

But before we write test cases, one thing may conern you is that codes like `newUser = User()` are not going to actually work, and that's why they are commented out. But it is not a bad thing: at this stage, instead of worrying about implementation, we should focus on business logic: what do we want to test?

Firstly, after objects are created in `setUp()`, we would like to validate `newUser` and `newAvatar`:

	  func testNewUserIsValid() {
		XCTAssertTrue(newUser.isValid())
	  }
	  func testNewAvatarIsValid() {
		XCTAssertTrue(newAvatar.isValid())
	  }

And secondly, it's also important that `author` of `newAvatar` should be the same as `newUser`:

	  func testNewAvatarHasNewUser() {
		let author: User! = newAvatar.author
		XCTAssertTrue(author as AnyObject === newUser as AnyObject)
	  }

So far we have implemented the bare-bones of our test class. But to actually make it executable, we need to implement minimium mock-up classes of `User` and `Avatar`, and inject mock `User` into `Avatar` to replace the dependency.

### Creating mock classes & test

When back-end is not ready, it is a common practice to test your app using mock data. Some networking libraries e.g. `Moya` provide ways to utilize a hard-coded JSON payload to simulate data return from API. Besides using mock JSON, mock classes can be useful for various reasons. In our case, we simply hide the potentially complex implementation, and instead only providing minimium details to pass our test. Once more details of business rules are provided in future, we can add more logic in our mock classes, or start working on the implementation of actual classes.

The minimium implementation for `User` would be:

	class MockUser: User {
	  var uid = -1
	  var username: String!
	  
	  required init() {
	  }
	  required init(username: String) {
		self.username = username
	  }
	  
	  func create(completion: ErrorClosure? = nil) {
		uid = 1
		if let closure = completion {
		  closure(nil)
		}
	  }
	  func query(uid: Int) {
		self.uid = uid
		username = String(format: "test%03d", uid)
	  }
	}

It starts with an invalid `uid`. After `create(completion:)`, `uid` will be set to `1` to make it valid; and after `query(uid:)`, both `uid` and `username` will be set up to simulate success object retieving. Again, this is the minimium implementation. We are not going to expand it in this tutorial, but potentially there are various things can be done, for example:

- Create a `MockFailureUser` that returns an error after in the completion closure of `create` to test error handling in your app
- Implement persistence layer to perform more tests

In the same manner let's create `MockAvatar`:

	class MockAvatar: Avatar {
	  var uid = -1
	  var imageURL = "http://www.superarts.org/injection/default.png"
	  var author: User!
	  
	  required init() {
	  }
	  required init(author: User) {
		self.author = author
	  }
	  
	  func create(completion: ErrorClosure? = nil) {
		uid = 1
		if let closure = completion {
		  closure(nil)
		}
	  }
	  func query(uid: Int) {
		self.uid = uid
		imageURL = String(format: "http://test.com/image%03d.png", uid)
		
		var user = DIManager.initUser()
		user.query(uid: 42)
		author = user
	  }
	}

An additional thing we are doing here is that in `query(uid:)`, we also create the `author` of `Avatar`, since an `Avatar` must have an `author`, according to our business rule.

Now we can actually make our test work by introducing dependency `MockUser` and `MockAvatar`:

    let exp = expectation(description: "\(#function)\(#line)")
    
    newUser = MockUser(username: "Ned Stark")
    newAvatar = MockAvatar(author: newUser)
    
    newAvatar.create(completion: { error in
      self.newUser.create(completion: { error in
        exp.fulfill()
      })
    })
    
    waitForExpectations(timeout: 60, handler: nil)

## Adding Swinject as our DI framework

Although our test works so far, you shouldn't be happy about code like `newUser = MockUser(username: "Ned Stark")`. Yes, it works for now, but when a cached `LocalUser` or a `RemoteUser` powered by back-end service are introduced, would we do a search-and-replace for all strings `MockUser` in our test file? At least there should be some mechanism like the following code, to provide some sort of flexibility:

    let userType: User.Type = MockUser.self
    let avatarType: Avatar.Type = MockAvatar.self
    
    newUser = userType.init(username: "Ned Stark")
    newAvatar = avatarType.init(author: newUser)

In this case, by changing `userType` and initialize all `Users` from it, the problem is kind of solved. Basically we're doing 2 things here:

1. Dependency configuration: `let userType: User.Type = MockUser.self`
2. Dependency resolution: `let newUser: User = userType.init(username: "Ned Stark")`

### Why we need a DI framework

Using `User.Type`, instead of `MockUser` to intialize `newUser`, is definitely an improvement here. It makes the dependency more obvious by saying something is a `User`, and its actual dependency is `MockUser`. It seems to be a good direction, and if we go further down this road, we would end up with a DI framework, which provides a more unified way to help us manage all these dependencies.

### Introducing DI framework Swinject

Let's make it clear: DI framework is not a MUST. As demostrated above, there are various ways to achieve DI in general, and even you want a DI framework you can always write your own. But of course, instead of handling things like [thread safty](https://github.com/Swinject/Swinject/blob/master/Documentation/ThreadSafety.md) yoursef, a more productive approach would be choosing a well structured, well maintained framework. In this example, we'll be using one of the most popular DI framework for `Swift`: [Swinject](https://github.com/Swinject/Swinject).

But before we start with `Swinject`, let's take a step back, and take a look at the concept of DI contaner.

### DI Container

Basically a DI container is the place that configures and resolves your dependencies. For example, without `Swinject`, we can create a `DIManager` to help us configure and resolve dependencies:

	//	configure
	struct DIManager {
		let userType: User.Type = MockUser.self
		let avatarType: Avatar.Type = MockAvatar.self
		static func setup() {
		  let userType: User.Type = MockUser.self
		  let avatarType: Avatar.Type = MockAvatar.self
		}
	}

	//	resolve
	let newUser: User = DIManager.userType.init(username: "Ned Stark")

One argument is whether dependencies should be managed in centralized places. Generally speaking, configuring and resolving dependencies at the same place, as shown in `NewUserAndAvatarWithoutSwinjectTests`, is easier to understand when dependencies are relatively simple, since codes are put in the same place, which makes them easy to read. In this case we don't need DI containers.

However, when dependencies become complex and even nested, utilizing DI container helps dependencies organized, and taking 5 minutes to read the code in DI container should give you an idea of the dependencies are structured. But again, there's no silver bullet that magically solves the problem of understanding complex dependencies. In the end, it's up to the experience of your own development team, but a lot of people are convinced that DI frameworks make their life easier.

### Adding Swinject to our project

The concept DI itself may not be that straightforward due to its "inversing" nature, but our own DI implementation above has been very simple. Using `Swinject` shouldn't be harder than that, right? Well `Swinject` actually is very easy to use. To create a DI container, we just need to write:

	import Swinject
	static let container = Container()

Bingo! A DI container is created. To configure and resolve dependencies, it's as simple as:

	container.register(User.self) { _ in MockUser() }
	let newUser = container.resolve(User.self)!

In our example, we also need objects to be initilized with parameter(s). This is still not complicated at all:

	container.register(User.self) { _, username in MockUser(username: username) }
	let newUser = container.resolve(User.self, argument: username)!

And now, our new `DIManager` would be:

	struct DIManager {
	  static let container = Container()
	  
	  @discardableResult
	  static func setup() -> Container {
		container.register(User.self) { _ in MockUser() }
		container.register(User.self) { _, username in MockUser(username: username) }
		container.register(Avatar.self) { _ in MockAvatar() }
		container.register(Avatar.self) { _, user in MockAvatar(author: user) }
		return container
	  }
	}

If you like the idea of putting configuring and resolving together, you can create extension like this:

	extension DIManager {
	  static func initUser(username: String) -> User {
		return container.resolve(User.self, argument: username)!
	  }
	  
	  // other initializers like initUser(), initAvatar(), initAvatar(author: User) ...
	}

If your prefer:

	let newUser = container.initUser(username: username)

Instead of:

	let newUser = container.resolve(User.self, argument: username)!

### Rewriting and adding more tests

After introducing `DIManager`, our `NewUserAndAvatarTests` is very simular with `NewUserAndAvatarWithoutSwinjectTests`. Instead of:

    let userType: User.Type = MockUser.self
    let avatarType: Avatar.Type = MockAvatar.self
    
    newUser = userType.init(username: "Ned Stark")
    newAvatar = avatarType.init(author: newUser)

In `setUp()`, we now have:

	DIManager.setup()
	newUser = DIManager.initUser(username: "Ned Stark")
	newAvatar = DIManager.initAvatar(author: newUser)

With our new `DIManager`, We also have `QueriedAvatarTests` and `QueriedUserTests` to make sure queried objects are valid. Have a look in `InjectionClubTests` to see how they work.

### Implementing mockup UI

Besides tests, we can also build minimium UI as proof of concepts. In `UserViewController`, we offer functionalities to create `User` objects and inspect them in debug log. It doesn't do much at the moment, but once classes like `RemoteUser` are implemented, `MockUser` can easily be replaced in `DIManager`, and both UI and tests are going to work immediately without any modification at all.

## Circular Dependencies

There are a lot of features in `Swinject`, for example `circular dependency injection`. Now let's take a look at "constructor injection" vs "setter injection", or "initializer injection" vs "property injection".

### Constructor injection and setter injection

In our previous code, `avatar = DIManager.initAvatar(author: user)` injects `User` into `Avatar` during construction phase. Not surprising at all, this is called "constructor injection", or "initializer injection". Another common approach would be "setter injection" or "property injection". As you may guess from the name itself, it describes that dependencies are injected as properties. Let's expand our example a bit.

### Example: User with avatar and Avatar with author

Logically, while `Avatar` should be created by a `User`, a `User` can still have an `Avatar` at the same time. This is called "circular dependencies", which means objects depend upon each other. In `Swinject`, to achieve circular dependency, at least one of the dependencies must be injected through a property. In our case, after injecting `User` to `Avatar`:

	let user = DIManager.initUser(username: "Ned Stark")
	let avatar = DIManager.initAvatar(author: user)

We need to inject `Avatar` to `User`:

	user.avatar = avatar

### Updating Interfaces

To do this, `protocol User` should be updated first:

	protocol User: Presentable, CustomStringConvertible {
	  var username: String! { get set }
	  weak var avatar: Avatar? { get set }

	  init()
	  init(username: String)
	}

As you may already know, when two classes reference each other strongly, it's going to create [strong reference cycle](https://www.raywenderlich.com/134411/arc-memory-management-swift). To avoid memory leak, we need to make propety `avatar` `weak`, for what we also need to change `protocol Avatar` to:

	protocol Avatar: class, Presentable, CustomStringConvertible

By putting `class` there, we allow `avatar` to be `weak` in `User`, thus breaking strong reference cycle.

### Updating NewUserAndAvatarTests

In `setUp()`, after `newAvatar` is created, we set its `avatar` to `newAvatar`:

		newAvatar.create(completion: { error in
		  self.newUser.avatar = self.newAvatar
		  self.newUser.create(completion: { error in
			exp.fulfill()
		  })
		})

And with this new test case, we'll be able to make sure `avatar` of `newUser` is `newUser`.

	  func testNewUserHasNewAvatar() {
		let avatar: Avatar! = newUser.avatar
		XCTAssertTrue(avatar as AnyObject === newAvatar as AnyObject)
	  }

### Updating MockUser

Of course we also need to update `MockUser` so that it conforms to the updated `User` protoco, but there's something tricky here to make `QueriedUserTests` work. Since we are providing a mock version of `query(uid:)`, while setting `username`, its `avatar` should also be created. But if we initialize an `Avatar` object and set it to `self.avatar`, since property `avatar` is `weak`, it will not be retained.

There are various ways to solve this problem. We work it around by adding a private strong property `_avatar` to help retain `avatar`:

	  weak var avatar: Avatar?
	  private var _avatar: Avatar?
	  func query(uid: Int) {
		self.uid = uid
		username = String(format: "test%03d", uid)
		
		let avatar = DIManager.initAvatar(author: self)
		avatar.create()
		_avatar = avatar
		self.avatar = avatar
	  }

Now run the tests and check all test cases to see how everything works.

## Where To Go From Here?

Nobody loves requirement changes, but that is generally a part of our lives as software engineers. As Bob Martin mentioned, we're already pretty good at reusing low level modules, for example a logging library, reason being that low level modules are always more generic, while high level modules are more likely to be based on very specific business requirements. 

Implementing DIP resolves this problem by introducing additional layers, to decouple high level modules with specific low level modules, thus it's easier to modify or reuse high level modules.

However, software architecture is not always self explained. I found it's very useful to spend an hour to talk with new guys joining the team, explaining how and why the code works in this way. It may sound stupid, but not everyone is doing it, especially for developers work remotely. Sometimes people are too proud of their code, but there is not always only one way to do things right, at least for architecturing.

Finally, thanks for reading this tutorial! If you would like to learn more about `Swinject`, check the "features" and "extensions" sections of [the github project](https://github.com/Swinject/Swinject). Also, you may want to check out other DI frameworks for iOS, for example [Typhoon](https://github.com/appsquickly/Typhoon) and [DIP](https://github.com/AliSoftware/Dip).

Happy architecturing and injecting!