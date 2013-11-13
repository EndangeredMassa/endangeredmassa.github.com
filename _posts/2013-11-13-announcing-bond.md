---
layout: post
title: "Announcing: bond 1.0.0"
author: Sean Massa
categories: [dev]
blurb:
  When switching from jasmine to mocha,
  I found myself missing jasmine spies.
  bond is my reproduction of jasmine spies
  (with a few enhancements)
  in a package that can be used with any testing framework.
published: false
---

## bond: the simple stub/spy JavaScript library

I wanted to have something that did one thing and did it well.
That thing is to stub/spy on JavaScript objects.

The name comes from a famous spy,
but it also fits gramatically.
You are `bond`ing a reference `to` a value:
`bond(object, property).to(value)`.

Given that I've not changed bond in 7 months,
I think it's time to release [`bond@1.0.0`](https://github.com/EndangeredMassa/bond).
It works in browsers and Node.js
([bondjs](https://npmjs.org/package/bondjs) on npm).

## bond api

You can checkout the full
[README](https://github.com/EndangeredMassa/bond/blob/master/README.md)
for a breakdown of the api,
but I wanted to call out the core concepts here.

The core method accepts an `object` and `propertyName`,
returning the bond api.

```javascript
bond(object, propertyName)
```

The bond api allows you to stub or spy on this property.
For example, you could stub a method to return a specific value with
`bond(object, methodName).return(someValue)`.
You can also stub a value property with 
`bond(object, propertyName).to(someValue)`.

There are some cases where you want to spy on a method without changing it.
For that, you can use `bond(object, methodName).through()`.

## bond spies

When you create a bond spy,
you can check to see how many times it was called with `spy.called`.
I abuse the fact that 0 is falsey when I use this method:
`if spy.called then ...`.

You can check that a spy was called with specific arguments as well:
`spy.calledWith(arg1, arg2, ...)`.

## conclusion

I have been using bond for about a year now.
I find that it does exactly what I need.

You can even use it to write a quick `require.cache` stub using bond:

```coffeescript
stubModule = (modulePath, stub) ->
  resolvedPath = require.resolve(modulePath)
  require.cache[resolvedPath] = stub
```

Let me know how you like bond below!
