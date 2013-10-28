---
layout: post
title: Handling Errors in Node.js
author: Sean Massa
categories: [dev]
blurb:
  The async callback standard in Node.js suggests
  that the first parameter of the callback
  is an error object.
  If that's null, you can move along.
  If it's not, or you have an error thrown elsewhere, 
  you have to figure out what to do.
  Let's take a look at our options!
published: true
---

The goal here is to capture errors (with context)
and format our logs for human readability.

## logging

The first thing we should investigate is
how we can format our error for log output.
There are a lot of logging libraries out there
that will handle this for you,
but I want to take a look at everything involved.

Let's first try simply sending the error to `stderr`.

```javascript
console.error( new Error('something broke') )
// [Error: something broke]
```

That only outputs the actual error message.
What about the stack trace?

```javascript
var error = new Error('something broke')
console.error( error.stack )
/*
Error: something broke
  at [eval]:1:16
  at Object.<anonymous> ([eval]-wrapper:6:22)
  at Module._compile (module.js:449:26)
  at evalScript (node.js:283:25)
  at startup (node.js:77:7)
  at node.js:628:3
*/
```

The stack property contains the message as well as the stack.
If we only log this value, we get both!
But what about other properties that might exist on the error object?

```javascript
var error = new Error('something broke')
console.error( JSON.stringify(error) )
// '{}'
```

That's empty, of course.
This is JavaScript-land, where making sense rarely matters.
JSON.stringify accepts more arguments.
We can pass filters in the second argument
and a number of indent spaces to use as the third.

```javascript
var error = new Error('something broke')
var message = JSON.stringify(error, ['stack', 'message'], 2)
console.error(message)
/*
{
  "stack": "Error: something broke\n    at Object.<anonymous> (/home/smassa/test.js:5:13)\n    at Module._compile (module.js:449:26)\n    at Object.Module._extensions..js (module.js:467:10)\n    at Module.load (module.js:356:32)\n    at Function.Module._load (module.js:312:12)\n    at Module.runMain (module.js:492:10)\n    at process.startup.processNextTick.process._tickCallback (node.js:245:9)",
  "message": "something broke"
}
*/
```

Now, if you are wondering why filtering works when not filtering already shows nothing--
like I said, JavaScript-land.

But what happens if the error object has other properties we care about?

```javascript
var error = new Error('something broke')
error.inner = new Error('some original error')
var message = JSON.stringify(error, ['stack', 'message', 'inner'], 2)
console.error(message)
/*
{
  "stack": "Error: something broke\n    at Object.<anonymous> (/home/smassa/test.js:2:13)\n    at Module._compile (module.js:449:26)\n    at Object.Module._extensions..js (module.js:467:10)\n    at Module.load (module.js:356:32)\n    at Function.Module._load (module.js:312:12)\n    at Module.runMain (module.js:492:10)\n    at process.startup.processNextTick.process._tickCallback (node.js:245:9)",
  "message": "something broke",
  "inner": {
    "stack": "Error: some original error\n    at Object.<anonymous> (/home/smassa/test.js:3:15)\n    at Module._compile (module.js:449:26)\n    at Object.Module._extensions..js (module.js:467:10)\n    at Module.load (module.js:356:32)\n    at Function.Module._load (module.js:312:12)\n    at Module.runMain (module.js:492:10)\n    at process.startup.processNextTick.process._tickCallback (node.js:245:9)",
    "message": "some original error"
  }
}
*/
```

This works, but requires you to list all potential extra properties in the filter list.
That means this won't be a great general purpose solution.
Let's explore `JSON.stringify` more.

```javascript
var error = new Error('something broke')
error.inner = new Error('some original error')
error.code = '500B'
var message = JSON.stringify(error, null, 2)
console.error(message)
/*
{
  "code":"500B",
  "inner":{}
}
*/
```

The normal property `code` was found properly,
`stack` and `error` are still missing as we expect,
but `inner` shows up with no content.
This makes sense as well--the value of `inner` is an Error object.

So, if we don't expect to have
nested Error objects--which is not
an unreasonable expectation--we could get
a pretty complete error log with the following.

Let's also pull in [prettyjson](https://npmjs.org/package/prettyjson)
for better formatted output.

```javascript
var prettyjson = require('prettyjson')
var formatJson = function(object) {
  // adds 4 spaces in front of each line
  var json = prettyjson.render(object)
  json = json.split('\n').join('\n    ')
  return '    ' + json
}

var error = new Error('something broke')
error.code = '500B'
error.severity = 'high'

var metadata = formatJson(error)
var stack = error.stack.trim()
var message = stack + '\n  Metadata:\n' + metadata
console.error(message)
/*
Error: something broke
    at Object.<anonymous> (/home/smassa/test.js:10:13)
    at Module._compile (module.js:449:26)
    at Object.Module._extensions..js (module.js:467:10)
    at Module.load (module.js:356:32)
    at Function.Module._load (module.js:312:12)
    at Module.runMain (module.js:492:10)
    at process.startup.processNextTick.process._tickCallback (node.js:245:9)
  Metadata:
    code:     500B
    severity: high
*/
```

However, if we do expect to have nested error objects,
we need to go a little further.
Until this requirement,
I wanted to stay away from modifying standard object prototypes.
If that doesn't bother you, read on!

It [turns out](http://stackoverflow.com/a/18391400/106)
that we can tell `Error` objects how to serialize themselves to json
by setting their `toJSON` properties.

```javascript
var config = {
  configurable: true,
  value: function() {
    var alt = {}
    var storeKey = function(key) {
      alt[key] = this[key]
    }

    Object.getOwnPropertyNames(this).forEach(storeKey, this)
    return alt
  }
}
Object.defineProperty(Error.prototype, 'toJSON', config)
```

Now, when we serialize our `Error` objects, we get:

```javascript
var error = new Error('something broke')
error.inner = new Error('some inner thing broke')
error.code = '500c'
error.severity = 'high'

var message = JSON.stringify(error, null, 2)
console.error(message)
/*
{
  "severity": "high",
  "message": "something broke",
  "code": "500c",
  "inner": {
    "message": "some inner thing broke",
    "stack": "Error: some inner thing broke\n    at Object.<anonymous> (/home/smassa/test.js:18:15)\n    at Module._compile (module.js:449:26)\n    at Object.Module._extensions..js (module.js:467:10)\n    at Module.load (module.js:356:32)\n    at Function.Module._load (module.js:312:12)\n    at Module.runMain (module.js:492:10)\n    at process.startup.processNextTick.process._tickCallback (node.js:245:9)"
  },
  "stack": "Error: something broke\n    at Object.<anonymous> (/home/smassa/test.js:17:13)\n    at Module._compile (module.js:449:26)\n    at Object.Module._extensions..js (module.js:467:10)\n    at Module.load (module.js:356:32)\n    at Function.Module._load (module.js:312:12)\n    at Module.runMain (module.js:492:10)\n    at process.startup.processNextTick.process._tickCallback (node.js:245:9)"
}
*/
```

This won't work directly wth prettyjson,
it strangley renders incomplete output,
but we can do something messy:

```javascript
var prettyjson = require('prettyjson')

var config = {
  configurable: true,
  value: function() {
    var alt = {}
    var storeKey = function(key) {
      alt[key] = this[key]
    }

    Object.getOwnPropertyNames(this).forEach(storeKey, this)
    return alt
  }
}
Object.defineProperty(Error.prototype, 'toJSON', config)

var error = new Error('something broke')
error.inner = new Error('some inner thing broke')
error.code = '500c'
error.severity = 'high'

var simpleError = JSON.parse(JSON.stringify(error))
var message = prettyjson.render(simpleError)
console.error(message)
/*
stack:    Error: something broke
    at Object.<anonymous> (/home/smassa/test.js:18:13)
    at Module._compile (module.js:449:26)
    at Object.Module._extensions..js (module.js:467:10)
    at Module.load (module.js:356:32)
    at Function.Module._load (module.js:312:12)
    at Module.runMain (module.js:492:10)
    at process.startup.processNextTick.process._tickCallback (node.js:245:9)
inner: 
  stack:   Error: some inner thing broke
    at Object.<anonymous> (/home/smassa/test.js:19:15)
    at Module._compile (module.js:449:26)
    at Object.Module._extensions..js (module.js:467:10)
    at Module.load (module.js:356:32)
    at Function.Module._load (module.js:312:12)
    at Module.runMain (module.js:492:10)
    at process.startup.processNextTick.process._tickCallback (node.js:245:9)
  message: some inner thing broke
severity: high
message:  something broke
code:     500c
*/
```

Which is not too bad.
If that doesn't overly disgust you,
this may be the solution you are looking for.
If it does, just go one solution back!

## long stack traces

Consider the following code
that throws errors from the event loop.

```javascript
function f() { throw new Error('foo') )
setTimeout(f, Math.random()*1000)
setTimeout(f, Math.random()*1000)

/*
timers.js:103
            if (!process.listeners('uncaughtException').length) throw e;
                                                                      ^
Error: foo
  at Object.f [as _onTimeout] (/home/smassa/source/demo/blog/test.js:8:11)
  at Timer.list.ontimeout (timers.js:101:19)
*/
```

Errors from code like this point to the event loop code where it was run
instead of the original code that put that event on the queue.
By using the `longjohn` module (`npm install longjohn`),
we can get longer stack traces that point to this original code!

```javascript
require('longjohn')

function f() { throw new Error('foo') }
setTimeout(f, Math.random()*1000)
setTimeout(f, Math.random()*1000)

/*
timers.js:103
            if (!process.listeners('uncaughtException').length) throw e;
                                                                      ^
Error: foo
    at f (/home/smassa/test.js:4:22)
    at list.ontimeout (timers.js:101:19)
---------------------------------------------
    at Object.<anonymous> (/home/smassa/test.js:5:1)
    at Module._compile (module.js:449:26)
    at Module._extensions..js (module.js:467:10)
    at Module.load (module.js:356:32)
    at Module._load (module.js:312:12)
    at Module.runMain (module.js:492:10)
    at startup.processNextTick.process._tickCallback (node.js:245:9)
*/
```

Note that this will get rid of your CoffeeScript line numbers, if you use CoffeeScript.
It sure would be great if [someone could fix that](https://github.com/mattinsler/longjohn/issues/11).
However, the value provided here is worth the inconvenience!

These longer stack traces can be invaluable.
Note that there are options for
limiting the number of async calls to trace back.

## process

The Node.js process doesn't know what to do when it encounters an uncaught error.
This usually crashed the process with a shallow stacked error as we saw above.
We can listen for these errors
and log them our way!

```javascript
require('longjohn')
var prettyjson = require('prettyjson')

function formatJson(object) {
  // adds 4 spaces in front of each line
  var json = prettyjson.render(object)
  json = json.split('\n').join('\n    ')
  return '    ' + json
}
  
function playNiceError(error) {
  // remove longjohn properties that break prettyjson
  delete error.__cached_trace__
  delete error.__previous__
  
  // remove domain information we probably don't need
  delete error.domain
}
  
function logError(error) {
  playNiceError(error)
  
  // Adding for fun; not for real use
  error.code = '500B'

  var metadata = formatJson(error)
  var stack = error.stack.trim()

  message = stack + '\n'
  if (metadata.trim() !== '') {
    message += '  Metadata:\n' + metadata 
  }
  console.error(message)
}

process.on('uncaughtException', logError)

function throwError() { throw new Error('foo') }
setTimeout(throwError, Math.random()*1000)

/*
Error: foo
    at throwError (/home/smassa/test.js:36:31)
    at list.ontimeout (timers.js:101:19)
---------------------------------------------
    at Object.<anonymous> (/home/smassa/test.js:37:1)
    at Module._compile (module.js:449:26)
    at Module._extensions..js (module.js:467:10)
    at Module.load (module.js:356:32)
    at Module._load (module.js:312:12)
    at Module.runMain (module.js:492:10)
    at startup.processNextTick.process._tickCallback (node.js:245:9)
  Metadata:
    code: 500B
*/
```

Note that the spacing is different here.
`longjohn`[ uses 4 spaces](https://github.com/mattinsler/longjohn/blob/master/lib/longjohn.coffee#L43-44)
for indentation instead of 2.
You can adjust the spacing in the logic above if you'd like the metadata to match.
I like having it stick about a bit, as above.

Now, whenever our process crashes, we should have a pretty good idea where!

## domains

[Domains](http://nodejs.org/api/domain.html)
attempt to solve a similar problem--knowing where
(and more context about where) an error occurs.
However, they attack the problem in a very different way.

When working with domains,
you are better off using `Node.js >= 0.10`.

Domains are integrated into the Node.js event system
such that all new EventEmitter objects
and all callbacks passed to low-level Node.js api calls
are bound to the active domain automatically.
That means that errors thrown in these areas
are captured and trigger an `error` event on the domain
instead of triggering an `uncaughtException` event on the entire process.

This example shows how this works.

```javascript
var fs = require('fs')
var domain = require('domain').create()

domain.on('error', function(error) {
  console.error('Caught error in domain!', error)
})
process.on('uncaughtException', function(error) {
  console.error('Caught error in process!', error)
})

domain.run(function(){
  process.nextTick(function(){
    setTimeout (function(){
      // simulating some various async stuff
      fs.open("non-existent file", "r", function(error, fd) {
        if (error) throw error
      })
    }, 10)
  })
})
/*
Caught error in domain! { [Error: ENOENT, open 'non-existent file']                                                                                                                [5/328]
  errno: 34,
  code: 'ENOENT',
  path: 'non-existent file',
  domain_thrown: true,
  domain: 
   { domain: null,
     _events: { error: [Function] },
     _maxListeners: 10,
     members: [] } }
*/
```

Success!
We did not crash our process
and could handle the error however we wanted.

If we use our error logger, we can get this:

```javascript
require('longjohn')

var fs = require('fs')
var domain = require('domain').create()

function logError(error) {
  // as defined earlier
}

domain.on('error', function(error) {
  logError(error)
})

domain.run(function(){
  process.nextTick(function(){
    setTimeout(function(){
      // simulating some various async stuff
      fs.open("non-existent file", "r", function(error, fd) {
        if (error) throw error
      })
    }, 10)
  })
})

/*
Error: ENOENT, open 'non-existent file'
---------------------------------------------
    at Object.<anonymous> (/home/smassa/test.js:39:8)
    at Module._compile (module.js:449:26)
    at Module._extensions..js (module.js:467:10)
    at Module.load (module.js:356:32)
    at Module._load (module.js:312:12)
    at Module.runMain (module.js:492:10)
    at startup.processNextTick.process._tickCallback (node.js:245:9)
  Metadata:
    errno:         34
    code:          500B
    path:          non-existent file
    domain_thrown: true
*/
```

That is a thing of beauty.
You can mix these into a web server's request/response cylce
for better request-based failures as well.

Remember that domains,
while very powerful,
should be used to
(1) better log and
(2) better handle your errors
before exiting the process.
That is, you should almost always exit your process
when you encounter an error
in your domain or process.
You don't want to continue doing work
with invalid application state.

## express server error handling

[Express](http://expressjs.com/)
is a popular web server module
that has a request/response cycle
based on the concept of middleware.

I set up a small express app
to demonstrate the different ways you can handle errors.

```
git clone git@github.com:EndangeredMassa/examples.git
cd examples/express-error-handling
npm install
```

To start it, run `node index.js` or `coffee index.coffee`.

This express app (now running on port 5555)
has three routes that work as follows:

### [/error](http://localhost:5555/error)

This route throws an error that is caught by the express middleware
and delegated to `express_logger.coffee`.

You should see output like:

```
Error: you went to /error, silly!
    at module.exports.app.use.response.status (/home/smassa/source/demo/blog/app.js:14:11)
    at callbacks (/home/smassa/source/demo/blog/node_modules/express/lib/router/index.js:164:37)
    at param (/home/smassa/source/demo/blog/node_modules/express/lib/router/index.js:138:11)
    at pass (/home/smassa/source/demo/blog/node_modules/express/lib/router/index.js:145:5)
    at Router._dispatch (/home/smassa/source/demo/blog/node_modules/express/lib/router/index.js:173:5)
    at router (/home/smassa/source/demo/blog/node_modules/express/lib/router/index.js:33:10)
    at next (/home/smassa/source/demo/blog/node_modules/express/node_modules/connect/lib/proto.js:190:15)
    at expressInit (/home/smassa/source/demo/blog/node_modules/express/lib/middleware.js:30:5)
    at next (/home/smassa/source/demo/blog/node_modules/express/node_modules/connect/lib/proto.js:190:15)
    at query (/home/smassa/source/demo/blog/node_modules/express/node_modules/connect/lib/middleware/query.js:44:5)
---------------------------------------------
    at new Server (http.js:1759:10)
    at exports.createServer (http.js:1776:10)
    at module.exports (/home/smassa/source/demo/blog/app.js:44:21)
    at Object.<anonymous> (/home/smassa/source/demo/blog/index.js:3:11)
    at Module._compile (module.js:449:26)
    at Module._extensions..js (module.js:467:10)
    at Module.load (module.js:356:32)
    at Module._load (module.js:312:12)
  Metadata:
    url:    /error
    action: GET
```

### [/asyncerror](http://localhost:5555/asyncerror)

This route throws an error from the event loop (via process uncaughtException)
and is delegated to `uncaught_handler.coffee`.
It also crashed the process.

You should see output like:

```
Error: you went to /asyncerror, silly!
    at module.exports.app.use.response.status (/home/smassa/source/demo/blog/app.js:19:13)
    at list.ontimeout (timers.js:101:19)
---------------------------------------------
    at /home/smassa/source/demo/blog/app.js:18:5
    at callbacks (/home/smassa/source/demo/blog/node_modules/express/lib/router/index.js:164:37)
    at param (/home/smassa/source/demo/blog/node_modules/express/lib/router/index.js:138:11)
    at pass (/home/smassa/source/demo/blog/node_modules/express/lib/router/index.js:145:5)
    at Router._dispatch (/home/smassa/source/demo/blog/node_modules/express/lib/router/index.js:173:5)
    at router (/home/smassa/source/demo/blog/node_modules/express/lib/router/index.js:33:10)
    at next (/home/smassa/source/demo/blog/node_modules/express/node_modules/connect/lib/proto.js:190:15)
    at expressInit (/home/smassa/source/demo/blog/node_modules/express/lib/middleware.js:30:5)
---------------------------------------------
    at new Server (http.js:1759:10)
    at exports.createServer (http.js:1776:10)
    at module.exports (/home/smassa/source/demo/blog/app.js:44:21)
    at Object.<anonymous> (/home/smassa/source/demo/blog/index.js:3:11)
    at Module._compile (module.js:449:26)
    at Module._extensions..js (module.js:467:10)
    at Module.load (module.js:356:32)
    at Module._load (module.js:312:12)
```

Note that we don't have any request metadata.

### [/domainerror](http://localhost:5555/domainerror)

This route throws an error from the event loop,
but bound to a domain,
and is delegated to `express_logger.coffee`
It also crashed the process.

You should see output like:

```
Error: you went to /domainerror, silly!
    at module.exports.app.use.response.status (/home/smassa/source/demo/blog/app.js:33:15)
    at list.ontimeout (timers.js:101:19)
---------------------------------------------
    at module.exports.app.use.response.status (/home/smassa/source/demo/blog/app.js:32:7)
    at Domain.bind.b (domain.js:201:18)
    at Domain.run (domain.js:141:23)
    at module.exports.app.use.response.status (/home/smassa/source/demo/blog/app.js:31:12)
    at callbacks (/home/smassa/source/demo/blog/node_modules/express/lib/router/index.js:164:37)
    at param (/home/smassa/source/demo/blog/node_modules/express/lib/router/index.js:138:11)
    at pass (/home/smassa/source/demo/blog/node_modules/express/lib/router/index.js:145:5)
    at Router._dispatch (/home/smassa/source/demo/blog/node_modules/express/lib/router/index.js:173:5)
---------------------------------------------
    at new Server (http.js:1759:10)
    at exports.createServer (http.js:1776:10)
    at module.exports (/home/smassa/source/demo/blog/app.js:44:21)
    at Object.<anonymous> (/home/smassa/source/demo/blog/index.js:3:11)
    at Module._compile (module.js:449:26)
    at Module._extensions..js (module.js:467:10)
    at Module.load (module.js:356:32)
    at Module._load (module.js:312:12)
  Metadata:
    domain_thrown: true
    url:           /domainerror
    action:        GET
```

The domain allowed us to capture the request metadata!

### directory structure

```
.
├── app.js              # setup the routes; start the app
├── express_logger.js   # log request information on error
├── index.js            # glue
├── last_resort.js      # exit the process after a timeout incase something bad happens
├── log_error.js        # pretty error log from previous sections
├── package.json 
└── uncaught_handler.js # closes the server; logs the error
```

This example includes airbrake integration as well.

## final code

We didn't have time to cover how you can manage crashing processes,
but I'm sure you can find information about that elsewhere.
(I like to use Node.js [cluster](http://nodejs.org/api/cluster.html).)

The final code (JavaScript and CoffeeScript) for everything you've seen here can be found here:

- [error logger](https://github.com/EndangeredMassa/examples/blob/master/express-error-handling/log_error.coffee)
- [express error handling](https://github.com/EndangeredMassa/examples/tree/master/express-error-handling)

Let me know in the comments
if you have other techniques for formatting errors!
