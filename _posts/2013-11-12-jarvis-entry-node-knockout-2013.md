---
layout: post
title: Jarvis: An Entry for Node Knockout 2013!
author: Sean Massa
categories: [dev]
blurb:
  Another year, another <a href="http://nodeknockout.com">Node Knockout</a>!
  Come check out our entry,
  <a href="http://nodeknockout.com/teams/rockem-sockem">Jarvis</a>!
published: true
---

This year, I didn't get an idea and team together
until very late in the process,
despite [my own advice against that](http://massalabs.com/dev/2013/10/30/how-to-hackathon.html).
It took me quite a long time to
[come up with an idea](http://massalabs.com/dev/2013/11/05/idea-generation.html)
that could
(1) be done in 48 hours and
(2) showcases Node.js in some way.

## Jarvis

We eventually decided to build a tool that
I've wanted to exist for some time.
The goal is to have a single place that allows you to
consume any type of content.
That includes RSS feeds,
youtube/vimeo videos,
podcasts,
images,
articles,
and whatever else you can find on the internet.

If every site implemented RSS in such a way that
I could subscribe to the strict subset of content I want,
this tool would not be necessary.
Sadly, RSS is often ignored or implemented globally for a site,
paying no mind to categories of content.

Jarvis lets you work around that issue.
Take a look at the pitch video.

<iframe width="640" height="390" src="http://www.youtube.com/embed/M42Qi8OxDpw" frameborder="0"></iframe>

Jarvis is also [open source](https://github.com/EndangeredMassa/jarvis)!
We need to do some post-hackathon code cleanup,
then we'll be ready to fix a few things,
and add some features!

The biggest things for the near future are:

* code cleanup
  * data model for sources and items
  * split into a daemon for processing and a web UI for viewing feeds
* auto-download videos when running locally
* don't re-add things that were removed
* twitter favorites should auto parse
* [dex](https://github.com/EndangeredMassa/Dex) integration
* ability to view and remove sources

Let me know what you'd like to see below!


