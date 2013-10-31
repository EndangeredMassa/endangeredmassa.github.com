---
layout: post
title: Working Around WebDriver
author: Sean Massa
categories: [dev]
blurb:
  Working with WebDriver can be really nice.
  It describes most actions you will need to automate a browser.
  However, there are some important holes in the spec.
  Let's figure out how to work around them!
published: false
---

[WebDriver](http://www.seleniumhq.org/projects/webdriver/) is a 
[spec](https://dvcs.w3.org/hg/webdriver/raw-file/tip/webdriver-spec.html#detecting-when-to-handle-commands)
that describes
[HTTP endpoints that use a JSON Wire Protocol](https://code.google.com/p/selenium/wiki/JsonWireProtocol)
for driving browsers to perform specific actions.
It's often used to do site scraping
and automated integration testing.

The relevant philsophy behind the project is that
(1) it should have actions that can emulate a user and
(2) it should only implement features that
work reasonable well and consistently across supported platforms.

These goals sound fine until you encounter a feature they don't encourage.
Here are a couple important features that fit that description.

1. does not support [retrieving response status codes or response headers](https://code.google.com/p/selenium/issues/detail?id=141)
2. does not support [sending request headers](https://code.google.com/p/selenium/wiki/JsonWireProtocol#/session/:sessionId/url)

When I was looking into working around this,
I found a couple "solutions" that mostly said "just use a proxy!"
Well, it's not that simple.

We need our proxy to:

1. Capture response status codes and headers:
   these must be for the initial html request, not subseuent resource requests
2. Store that data in a place accessible to the code using WebDriver:
   this can include modifying the response to add a cookie,
   using interprocess communication (IPC),
   or using some shared state between the servers in the same process 
3. Modify requests to include/change headers

Let's explore how we can accomplish each of these.

## 1. Capture Response Status Codes and Headers

## 2. Communicate Response Data to Consumer Code

- setup proxy
- set response cookie
- hide from retrieval

## 3. Modify Request Headers

## Improving the Setup

- consider using [browsermob](http://bmp.lightbody.net) Instead
- thoughts in comments
