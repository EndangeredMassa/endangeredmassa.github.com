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
published: true
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

```coffeescript
console.error (new Error 'something broke')
# [Error: something broke]
```

That only outputs the actual error message.
What about the stack trace?

```coffeescript
console.error (new Error 'something broke').stack
###
Error: something broke
  at [eval]:1:16
  at Object.<anonymous> ([eval]-wrapper:6:22)
  at Module._compile (module.js:449:26)
  at evalScript (node.js:283:25)
  at startup (node.js:77:7)
  at node.js:628:3
###
```

The stack property contains the message as well as the stack.
If we only log this value, we get both!
But what about other properties that might exist on the error object?

```coffeescript
console.error JSON.stringify (new Error 'something broke')
# '{}'
```

That's empty, of course.
This is JavaScript-land, where making sense rarely matters.
JSON.stringify accepts more arguments.
We can pass filters in the second argument
and a number of indent spaces to use as the third.

```coffeescript
error = new Error 'something broke'
console.error JSON.stringify error, ['stack', 'message'], 2
###
{
  "stack":"Error: something broke\n  at Object.<anonymous> (/home/smassa/test.coffee:5:9, <js>:7:11)\n  at Object.<anonymous> (/home/smassa/test.coffee:6:1, <js>:12:3)\n  at Module._compile (module.js:449:26)\n  at runModule (/home/smassa/.nvm/v0.8.25/lib/node_modules/coffee-script-redux/lib/run.js:101:17)\n  at runMain (/home/smassa/.nvm/v0.8.25/lib/node_modules/coffee-script-redux/lib/run.js:94:10)\n  at processInput (/home/smassa/.nvm/v0.8.25/lib/node_modules/coffee-script-redux/lib/cli.js:272:7)\n  at /home/smassa/.nvm/v0.8.25/lib/node_modules/coffee-script-redux/lib/cli.js:286:16\n  at fs.readFile (fs.js:176:14)\n  at Object.oncomplete (fs.js:297:15)\n",
  "message":"something broke"
}
###
```

Now, if you are wondering why filtering works when not filtering already shows nothing--
like I said, JavaScript-land.

But what happens if the error object has other properties we care about?

```coffeescript
error = new Error 'something broke'
error.inner = new Error 'some original error'
error.code = '500B'
JSON.stringify error, ['stack', 'message', 'inner'], 2
###
{
  "stack":"Error: something broke\n  at Object.<anonymous> (/home/smassa/test.coffee:5:9, <js>:7:11)\n  at Object.<anonymous> (/home/smassa/test.coffee:8:1, <js>:16:3)\n  at Module._compile (module.js:449:26)\n  at runModule (/home/smassa/.nvm/v0.8.25/lib/node_modules/coffee-script-redux/lib/run.js:101:17)\n  at runMain (/home/smassa/.nvm/v0.8.25/lib/node_modules/coffee-script-redux/lib/run.js:94:10)\n  at processInput (/home/smassa/.nvm/v0.8.25/lib/node_modules/coffee-script-redux/lib/cli.js:272:7)\n  at /home/smassa/.nvm/v0.8.25/lib/node_modules/coffee-script-redux/lib/cli.js:286:16\n  at fs.readFile (fs.js:176:14)\n  at Object.oncomplete (fs.js:297:15)\n",
  "message":"something broke",
  "inner":{
    "stack":"Error: some original error\n  at Object.<anonymous> (/home/smassa/test.coffee:7:15, <js>:9:17)\n  at Object.<anonymous> (/home/smassa/test.coffee:8:1, <js>:16:3)\n  at Module._compile (module.js:449:26)\n  at runModule (/home/smassa/.nvm/v0.8.25/lib/node_modules/coffee-script-redux/lib/run.js:101:17)\n  at runMain (/home/smassa/.nvm/v0.8.25/lib/node_modules/coffee-script-redux/lib/run.js:94:10)\n  at processInput (/home/smassa/.nvm/v0.8.25/lib/node_modules/coffee-script-redux/lib/cli.js:272:7)\n  at /home/smassa/.nvm/v0.8.25/lib/node_modules/coffee-script-redux/lib/cli.js:286:16\n  at fs.readFile (fs.js:176:14)\n  at Object.oncomplete (fs.js:297:15)\n",
    "message":"some original error"
  },
  "code":"500B"
}
###
```

This works, but requires you to list all potential extra properties in the filter list.
That means this won't be a great general purpose solution.
Let's explore `JSON.stringify` more.

```coffeescript
error = new Error 'something broke'
error.inner = new Error 'some original error'
error.code = '500B'
JSON.stringify error, null, 2
###
{
  "code":"500B",
  "inner":{}
}
###
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

```coffeescript
prettyjson = require('prettyjson')                                                                                                                                                        
formatJson = (object) ->
  # adds 4 spaces in front of each line
  json = prettyjson.render(object)
  json = json.split('\n').join('\n    ')
  "    #{json}"

error = new Error 'something broke'
error.code = '500B'
error.severity = 'high'

metadata = formatJson error
stack = error.stack.trim()
"#{stack}\n  Metadata:\n#{metadata}"
###
Error: something broke
  at Object.<anonymous> (/home/smassa/source/demo/blog/test.coffee:11:11, <js>:14:11)
  at Object.<anonymous> (/home/smassa/source/demo/blog/test.coffee:17:1, <js>:20:3)
  at Module._compile (module.js:449:26)
  at runModule (/home/smassa/.nvm/v0.8.25/lib/node_modules/coffee-script-redux/lib/run.js:101:17)
  at runMain (/home/smassa/.nvm/v0.8.25/lib/node_modules/coffee-script-redux/lib/run.js:94:10)
  at processInput (/home/smassa/.nvm/v0.8.25/lib/node_modules/coffee-script-redux/lib/cli.js:272:7)
  at /home/smassa/.nvm/v0.8.25/lib/node_modules/coffee-script-redux/lib/cli.js:286:16
  at fs.readFile (fs.js:176:14)
  at Object.oncomplete (fs.js:297:15)
  Metadata:
    code:     500B
    severity: high
###
```

However, if we do expect to have nested error objects,
we need to go a little further.
Until this requirement,
I wanted to stay away from modifying standard object prototypes.
If that doesn't bother you, read on!

It [turns out](http://stackoverflow.com/a/18391400/106)
that we can tell `Error` objects how to serialize themselves to json
by setting their `toJSON` properties.

```coffeescript
Object.defineProperty Error.prototype, 'toJSON',
  configurable: true
  value: ->
    alt = {}
    storeKey = (key) ->
      alt[key] = this[key]

    Object.getOwnPropertyNames(this).forEach(storeKey, this)
    alt
```

Now, when we serialize our `Error` objects, we get:

```coffeescript
error = new Error 'something broke'
error.inner = new Error 'some inner thing broke'
error.code = '500c'
error.severity = 'high'

JSON.stringify error, null, 2
###
{
  "message":"something broke",
  "code":"500c",
  "severity":"high",
  "inner":{
    "message":"some inner thing broke",
    "stack":"Error: some inner thing broke\n  at Object.<anonymous> (/home/smassa/source/demo/blog/test.coffee:16:15, <js>:20:17)\n  at Object.<anonymous> (/home/smassa/source/demo/blog/test.coffee:20:1, <js>:24:3)\n  at Module._compile (module.js:449:26)\n  at runModule (/home/smassa/.nvm/v0.8.25/lib/node_modules/coffee-script-redux/lib/run.js:101:17)\n  at runMain (/home/smassa/.nvm/v0.8.25/lib/node_modules/coffee-script-redux/lib/run.js:94:10)\n  at processInput (/home/smassa/.nvm/v0.8.25/lib/node_modules/coffee-script-redux/lib/cli.js:272:7)\n  at /home/smassa/.nvm/v0.8.25/lib/node_modules/coffee-script-redux/lib/cli.js:286:16\n  at fs.readFile (fs.js:176:14)\n  at Object.oncomplete (fs.js:297:15)\n"
  },
  "stack":"Error: something broke\n  at Object.<anonymous> (/home/smassa/source/demo/blog/test.coffee:15:13, <js>:19:11)\n  at Object.<anonymous> (/home/smassa/source/demo/blog/test.coffee:20:1, <js>:24:3)\n  at Module._compile (module.js:449:26)\n  at runModule (/home/smassa/.nvm/v0.8.25/lib/node_modules/coffee-script-redux/lib/run.js:101:17)\n  at runMain (/home/smassa/.nvm/v0.8.25/lib/node_modules/coffee-script-redux/lib/run.js:94:10)\n  at processInput (/home/smassa/.nvm/v0.8.25/lib/node_modules/coffee-script-redux/lib/cli.js:272:7)\n  at /home/smassa/.nvm/v0.8.25/lib/node_modules/coffee-script-redux/lib/cli.js:286:16\n  at fs.readFile (fs.js:176:14)\n  at Object.oncomplete (fs.js:297:15)\n"
}
###
```

This won't work directly wth prettyjson,
but we can do something messy:

```coffeescript
prettyjson = require 'prettyjson'
Object.defineProperty Error.prototype, 'toJSON',
  configurable: true
  value: ->
    alt = {}
    storeKey = (key) ->
      alt[key] = this[key]

    Object.getOwnPropertyNames(this).forEach(storeKey, this)
    alt
                                                                                                                                                                                          
error = new Error 'something broke'
error.inner = new Error 'some inner thing broke'
error.code = '500c'
error.severity = 'high'

prettyjson.render JSON.parse JSON.stringify error
###
severity: high                                                                                                                                                                     [0/150]
inner: 
  stack:   Error: some inner thing broke
  at Object.<anonymous> (/home/smassa/source/demo/blog/test.coffee:17:15, <js>:21:17)
  at Object.<anonymous> (/home/smassa/source/demo/blog/test.coffee:21:1, <js>:25:3)
  at Module._compile (module.js:449:26)
  at runModule (/home/smassa/.nvm/v0.8.25/lib/node_modules/coffee-script-redux/lib/run.js:101:17)
  at runMain (/home/smassa/.nvm/v0.8.25/lib/node_modules/coffee-script-redux/lib/run.js:94:10)
  at processInput (/home/smassa/.nvm/v0.8.25/lib/node_modules/coffee-script-redux/lib/cli.js:272:7)
  at /home/smassa/.nvm/v0.8.25/lib/node_modules/coffee-script-redux/lib/cli.js:286:16
  at fs.readFile (fs.js:176:14)
  at Object.oncomplete (fs.js:297:15)

  message: some inner thing broke
stack:    Error: something broke
  at Object.<anonymous> (/home/smassa/source/demo/blog/test.coffee:16:13, <js>:20:11)
  at Object.<anonymous> (/home/smassa/source/demo/blog/test.coffee:21:1, <js>:25:3)
  at Module._compile (module.js:449:26)
  at runModule (/home/smassa/.nvm/v0.8.25/lib/node_modules/coffee-script-redux/lib/run.js:101:17)
  at runMain (/home/smassa/.nvm/v0.8.25/lib/node_modules/coffee-script-redux/lib/run.js:94:10)
  at processInput (/home/smassa/.nvm/v0.8.25/lib/node_modules/coffee-script-redux/lib/cli.js:272:7)
  at /home/smassa/.nvm/v0.8.25/lib/node_modules/coffee-script-redux/lib/cli.js:286:16
  at fs.readFile (fs.js:176:14)
  at Object.oncomplete (fs.js:297:15)

message:  something broke
code:     500c
###
```

Which is not too bad.
If that doesn't overly disgust you,
this may be the solution you are looking for.
If it does, just go one solution back!

## long stack traces

Consider the following code
that throws errors from the event loop.

```coffeescript
f = -> throw new Error('foo')
setTimeout(f, Math.random()*1000)
setTimeout(f, Math.random()*1000)

###
timers.js:103
            if (!process.listeners('uncaughtException').length) throw e;
                                                                      ^
Error: foo
  at Object.f [as _onTimeout] (/home/smassa/source/demo/blog/test.coffee:5:14, <js>:8:11)
  at Timer.list.ontimeout (timers.js:101:19)
###
```

Errors from code like this point to the event loop code where it was run
instead of the original code that put that event on the queue.
By using the `longjohn` module (`npm install longjohn`),
we can get longer stack traces that point to this original code!

```coffeescript
require 'longjohn'

f = -> throw new Error('foo')
setTimeout(f, Math.random()*1000)
setTimeout(f, Math.random()*1000)

###
timers.js:103
            if (!process.listeners('uncaughtException').length) throw e;
                                                                      ^
Error: foo
    at f (/home/smassa/source/demo/blog/test.coffee:9:11)
    at list.ontimeout (timers.js:101:19)
---------------------------------------------
    at Object.<anonymous> (/home/smassa/source/demo/blog/test.coffee:12:3)
    at Object.<anonymous> (/home/smassa/source/demo/blog/test.coffee:13:3)
    at Module._compile (module.js:449:26)
    at runModule (/home/smassa/.nvm/v0.8.25/lib/node_modules/coffee-script-redux/lib/run.js:101:17)
    at runMain (/home/smassa/.nvm/v0.8.25/lib/node_modules/coffee-script-redux/lib/run.js:94:10)
    at processInput (/home/smassa/.nvm/v0.8.25/lib/node_modules/coffee-script-redux/lib/cli.js:272:7)
    at /home/smassa/.nvm/v0.8.25/lib/node_modules/coffee-script-redux/lib/cli.js:286:16
    at fs.readFile (fs.js:176:14)
###
```

You may notice that my fancy coffee-script line numbers are gone.
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

```coffeescript
require 'longjohn'                                                                                                                                                                        
prettyjson = require('prettyjson')

formatJson = (object) ->
  # adds 4 spaces in front of each line
  json = prettyjson.render(object)
  json = json.split('\n').join('\n    ')
  "    #{json}"
  
playNiceError = (error) ->
  # remove longjohn properties that break prettyjson
  delete error.__cached_trace__
  delete error.__previous__
  
logError = (error) ->
  playNiceError(error)
  
  # Adding for fun; not for real use
  error.code = '500B'

  metadata = formatJson error
  stack = error.stack.trim()

  message = "#{stack}\n"
  message += "  Metadata:\n#{metadata}" if metadata.trim() != ''
  console.error message
  
process.on 'uncaughtException', logError

throwError = -> throw new Error('foo')
setTimeout(throwError, Math.random()*1000)

###
Error: foo
    at f (/home/smassa/source/demo/blog/test.coffee:28:11)
    at list.ontimeout (timers.js:101:19)
---------------------------------------------
    at Object.<anonymous> (/home/smassa/source/demo/blog/test.coffee:30:3)
    at Object.<anonymous> (/home/smassa/source/demo/blog/test.coffee:31:3)
    at Module._compile (module.js:449:26)
    at runModule (/home/smassa/.nvm/v0.8.25/lib/node_modules/coffee-script-redux/lib/run.js:101:17)
    at runMain (/home/smassa/.nvm/v0.8.25/lib/node_modules/coffee-script-redux/lib/run.js:94:10)
    at processInput (/home/smassa/.nvm/v0.8.25/lib/node_modules/coffee-script-redux/lib/cli.js:272:7)
    at /home/smassa/.nvm/v0.8.25/lib/node_modules/coffee-script-redux/lib/cli.js:286:16
    at fs.readFile (fs.js:176:14)
  Metadata:
    code: 500B
###
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

```coffeescript
fs = require 'fs'
domain = require('domain').create()

domain.on "error", (error) ->
  console.error "Caught error in domain!", error
process.on 'uncaughtException', (error) ->
  console.error "Caught error in process!", error

domain.run ->
  process.nextTick ->
    setTimeout (->
      # simulating some various async stuff
      fs.open "non-existent file", "r", (error, fd) ->
        throw error if error?
    ), 10

###
Caught error in domain! { [Error: ENOENT, open 'non-existent file']
  errno: 34,
  code: 'ENOENT',
  path: 'non-existent file',
  domain: 
   { domain: null,
     _events: { error: [Function] },
     _maxListeners: 10,
     members: [] },
  domainThrown: true }
###
```

Success!
We did not crash our process
and could handle the error however we wanted.

If we use our error logger, we can get this:

```coffeescript
fs = require 'fs'
domain = require('domain').create()                                                          
                                                                                             
domain.on "error", (error) ->                                                                
  logError error
  
domain.run ->
  process.nextTick ->                                                                        
    setTimeout (->                                                                           
      # simulating some various async stuff                                                  
      fs.open "non-existent file", "r", (error, fd) ->                                                                                                                                    
        throw error if error?
    ), 10

###
Error: ENOENT, open 'non-existent file'
---------------------------------------------
    at Object.<anonymous> (/home/smassa/source/demo/blog/test.coffee:7:10)
    at Object.<anonymous> (/home/smassa/source/demo/blog/test.coffee:20:3)
    at Module._compile (module.js:456:26)
    at runModule (/home/smassa/.nvm/v0.10.19/lib/node_modules/coffee-script-redux/lib/run.js:101:17)
    at runMain (/home/smassa/.nvm/v0.10.19/lib/node_modules/coffee-script-redux/lib/run.js:94:10)
    at processInput (/home/smassa/.nvm/v0.10.19/lib/node_modules/coffee-script-redux/lib/cli.js:272:7)
    at /home/smassa/.nvm/v0.10.19/lib/node_modules/coffee-script-redux/lib/cli.js:286:16
    at fs.js:266:14
  Metadata:
    errno:        34
    code:         ENOENT
    path:         non-existent file
    domainThrown: true
###
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
git clone git@github.com:EndangeredMassa/express-error-handling.git
cd express-error-handling
npm install
npm start
```

This express app (now running on port 5555)
has three routes that work as follows:

### [/error](http://localhost:5555/error)

This route throws an error that is caught by the express middleware
and delegated to `express_logger.coffee`.

You should see output like:

```
Error: you went to /error, silly!
    at /home/smassa/source/demo/blog/app.coffee:16:13
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
    at new Server (http.js:1870:10)
    at exports.createServer (http.js:1900:10)
    at module.exports (/home/smassa/source/demo/blog/app.coffee:43:19)
    at Object.<anonymous> (/home/smassa/source/demo/blog/index.coffee:6:9)
    at Object.<anonymous> (/home/smassa/source/demo/blog/index.coffee:10:3)
    at Module._compile (module.js:456:26)
    at runModule (/home/smassa/source/demo/blog/node_modules/coffee-script-redux/lib/run.js:101:17)
    at runMain (/home/smassa/source/demo/blog/node_modules/coffee-script-redux/lib/run.js:94:10)
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
    at [object Object].<anonymous> (/home/smassa/source/demo/blog/app.coffee:20:15)
    at listOnTimeout (timers.js:110:15)
---------------------------------------------
    at /home/smassa/source/demo/blog/app.coffee:19:14
    at callbacks (/home/smassa/source/demo/blog/node_modules/express/lib/router/index.js:164:37)
    at param (/home/smassa/source/demo/blog/node_modules/express/lib/router/index.js:138:11)
    at pass (/home/smassa/source/demo/blog/node_modules/express/lib/router/index.js:145:5)
    at Router._dispatch (/home/smassa/source/demo/blog/node_modules/express/lib/router/index.js:173:5)
    at router (/home/smassa/source/demo/blog/node_modules/express/lib/router/index.js:33:10)
    at next (/home/smassa/source/demo/blog/node_modules/express/node_modules/connect/lib/proto.js:190:15)
    at expressInit (/home/smassa/source/demo/blog/node_modules/express/lib/middleware.js:30:5)
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
    at [object Object].<anonymous> (/home/smassa/source/demo/blog/app.coffee:34:17)
    at listOnTimeout (timers.js:110:15)
---------------------------------------------
    at /home/smassa/source/demo/blog/app.coffee:33:16
    at b (domain.js:183:18)
    at Domain.run (domain.js:123:23)
    at /home/smassa/source/demo/blog/app.coffee:32:21
    at callbacks (/home/smassa/source/demo/blog/node_modules/express/lib/router/index.js:164:37)
    at param (/home/smassa/source/demo/blog/node_modules/express/lib/router/index.js:138:11)
    at pass (/home/smassa/source/demo/blog/node_modules/express/lib/router/index.js:145:5)
    at Router._dispatch (/home/smassa/source/demo/blog/node_modules/express/lib/router/index.js:173:5)
---------------------------------------------
    at new Server (http.js:1870:10)
    at exports.createServer (http.js:1900:10)
    at module.exports (/home/smassa/source/demo/blog/app.coffee:43:19)
    at Object.<anonymous> (/home/smassa/source/demo/blog/index.coffee:6:9)
    at Object.<anonymous> (/home/smassa/source/demo/blog/index.coffee:10:3)
    at Module._compile (module.js:456:26)
    at runModule (/home/smassa/source/demo/blog/node_modules/coffee-script-redux/lib/run.js:101:17)
    at runMain (/home/smassa/source/demo/blog/node_modules/coffee-script-redux/lib/run.js:94:10)
  Metadata:
    domainThrown: true
    url:          /domainerror
    action:       GET
```

The domain allowed us to capture the request metadata!

### directory structure

```
.
├── app.coffee              # setup the routes; start the app
├── express_logger.coffee   # log request information on error
├── index.coffee            # glue
├── last_resort.coffee      # exit the process after a timeout incase something bad happens
├── log_error.coffee        # pretty error log from previous sections
├── package.json 
└── uncaught_handler.coffee # closes the server; logs the error
```

This example includes airbrake integration as well.

## final code

We didn't have time to cover how you can manage crashing processes,
but I'm sure you can find information about that elsewhere.
(I like to use Node.js [cluster](http://nodejs.org/api/cluster.html).)

The final code for everything you've seen here can be found here:

- [error logger](https://github.com/EndangeredMassa/express-error-handling/blob/master/log_error.coffee)
- [express error handling](https://github.com/EndangeredMassa/express-error-handling)
