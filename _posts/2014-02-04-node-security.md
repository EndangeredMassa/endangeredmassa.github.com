---
layout: post
title: "automatic nodesecurity.io validation of dependencies"
author: Sean Massa
categories: [dev]
blurb:
  The amazing <a href="https://nodesecurity.io">Node Security Project</a>
  is attempting to audit all node modules
  for security issues.
  
  There is a
  <a href="http://blog.nodesecurity.io/post/75342048303/new-feature-validate-modules-with-npm-shrinkwrap">new endpoint available</a>
  that allows you to submit your `npm-shrinkwrap.json` file
  and receive a list of security advisories
  for all modules in your dependency tree.  
published: true
---

You can wire this up to a build or release process,
providing some comfort that
you are not using known bad versions
of specific node modules.
Below is a simple coffeescript file to do just that:

```coffeescript
# this file assumes it exists one level deep in your project
# in ./scripts/security_check.coffee, for example
request = require 'request'

url = 'https://nodesecurity.io/validate/shrinkwrap'
postData = require "#{__dirname}/../npm-shrinkwrap.json"
options =
  url: url
  json: true
  body: postData

request.post options, (error, response, data) ->
  if error?
    console.error error
    process.exit 1

  if data.length == 0
    process.exit 0

  console.log 'Security Advisories Detected!'
  console.log data
  process.exit 2
```

When you execute this,
your project's npm-shrinkwrap.json file
is sent to nodesecurity.io for validation.
The response is a JSON array of
applicable security advisories.
If it's empty, you are in the clear!
If it's not, this script will
output all advisories
for you to deal with.

The API is subject to change.
If you have any issues,
please report them on the
[repo](https://github.com/nodesecurity/nodesecurity-www/issues)!
