---
layout: post
title: Handling Errors in Node.js
author: Sean Massa
categories: [dev]
blurb:
  The async callback standard in Node.js suggests that the first parameter of the callback
  is an error object. If that's null, you can move along. If it's not, you have to
  figure out what to do. Let's take a look at our options!
published: false
---

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

That only output the actual error message.
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
This is JavaScript-land, after all.
JSON.stringify accepts more arguments.
We can pass filters in the second argument.

```coffeescript
error = new Error 'something broke'
console.error JSON.stringify error, ['stack', 'message']
# {"stack":"Error: something broke\n  at Object.<anonymous> (/home/smassa/test.coffee:5:9, <js>:7:11)\n  at Object.<anonymous> (/home/smassa/test.coffee:6:1, <js>:12:3)\n  at Module._compile (module.js:449:26)\n  at runModule (/home/smassa/.nvm/v0.8.25/lib/node_modules/coffee-script-redux/lib/run.js:101:17)\n  at runMain (/home/smassa/.nvm/v0.8.25/lib/node_modules/coffee-script-redux/lib/run.js:94:10)\n  at processInput (/home/smassa/.nvm/v0.8.25/lib/node_modules/coffee-script-redux/lib/cli.js:272:7)\n  at /home/smassa/.nvm/v0.8.25/lib/node_modules/coffee-script-redux/lib/cli.js:286:16\n  at fs.readFile (fs.js:176:14)\n  at Object.oncomplete (fs.js:297:15)\n","message":"something broke"}
```

The JSON format is a bit hard on the eyes,
but an extra formatting step could make that cleaner.
If you are wondering why filtering works when not filtering already shows nothing--
like I said, JavaScript-land.

But what happens if the error object has other properties we care about?

```coffeescript
error = new Error 'something broke'
error.inner = new Error 'some original error'
error.code = '500B'
JSON.stringify error, ['stack', 'message', 'inner']
# {"stack":"Error: something broke\n  at Object.<anonymous> (/home/smassa/test.coffee:5:9, <js>:7:11)\n  at Object.<anonymous> (/home/smassa/test.coffee:8:1, <js>:16:3)\n  at Module._compile (module.js:449:26)\n  at runModule (/home/smassa/.nvm/v0.8.25/lib/node_modules/coffee-script-redux/lib/run.js:101:17)\n  at runMain (/home/smassa/.nvm/v0.8.25/lib/node_modules/coffee-script-redux/lib/run.js:94:10)\n  at processInput (/home/smassa/.nvm/v0.8.25/lib/node_modules/coffee-script-redux/lib/cli.js:272:7)\n  at /home/smassa/.nvm/v0.8.25/lib/node_modules/coffee-script-redux/lib/cli.js:286:16\n  at fs.readFile (fs.js:176:14)\n  at Object.oncomplete (fs.js:297:15)\n","message":"something broke","inner":{"stack":"Error: some original error\n  at Object.<anonymous> (/home/smassa/test.coffee:7:15, <js>:9:17)\n  at Object.<anonymous> (/home/smassa/test.coffee:8:1, <js>:16:3)\n  at Module._compile (module.js:449:26)\n  at runModule (/home/smassa/.nvm/v0.8.25/lib/node_modules/coffee-script-redux/lib/run.js:101:17)\n  at runMain (/home/smassa/.nvm/v0.8.25/lib/node_modules/coffee-script-redux/lib/run.js:94:10)\n  at processInput (/home/smassa/.nvm/v0.8.25/lib/node_modules/coffee-script-redux/lib/cli.js:272:7)\n  at /home/smassa/.nvm/v0.8.25/lib/node_modules/coffee-script-redux/lib/cli.js:286:16\n  at fs.readFile (fs.js:176:14)\n  at Object.oncomplete (fs.js:297:15)\n","message":"some original error"},"code":"500B"}
```

This works, but requires you to list all potential extra properties in the filter list.
That means this won't be a great general purpose solution.
Let's revisit our original attempt with a twist.

```coffeescript
error = new Error 'something broke'
error.inner = new Error 'some original error'
error.code = '500B'
JSON.stringify error
# {"code":"500B","inner":{}}
```

The normal property `code` was found properly,
`stack` and `error` are still missing as we expect,
but `inner` shows up with no content.
This makes sense as well--
the value of `inner` is an Error object.

So, if we don't expect to have nested Error objects--
which is not an unreasonable expectation--
we could get a pretty complete error log with the following.

```coffeescript
error = new Error 'something broke'
error.code = '500B'

stack = error.stack.trim()
metadata = JSON.stringify error
"#{stack}\n  Metadata:#{metadata}"
###
Error: something broke
  at Object.<anonymous> (/home/smassa/test.coffee:5:9, <js>:7:11)
  at Object.<anonymous> (/home/smassa/test.coffee:10:1, <js>:12:3)
  at Module._compile (module.js:449:26)
  at runModule (/home/smassa/.nvm/v0.8.25/lib/node_modules/coffee-script-redux/lib/run.js:101:17)
  at runMain (/home/smassa/.nvm/v0.8.25/lib/node_modules/coffee-script-redux/lib/run.js:94:10)
  at processInput (/home/smassa/.nvm/v0.8.25/lib/node_modules/coffee-script-redux/lib/cli.js:272:7)
  at /home/smassa/.nvm/v0.8.25/lib/node_modules/coffee-script-redux/lib/cli.js:286:16
  at fs.readFile (fs.js:176:14)
  at Object.oncomplete (fs.js:297:15)
  Metadata:{"code":"500B"}
###
```






## long stack traces
`npm install long-stack-traces`
https://github.com/tlrobinson/long-stack-traces



## process

```
process.on 'uncaughtException', (error) ->
  log.error(error)
```


## domains


## express error middleware





