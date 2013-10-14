---
layout: post
title: Managing a Node.js Project
author: Sean Massa
categories: [dev]
blurb:
  Working with Node.js and npm can be a lot of fun
  until you have other people actually using your software!
  Now your users expect your code to work,
  especially when they use new versions that match their fuzzy selectors.
published: true
---

We're going to assume some Github (pull request) familiarity,
but the principles apply regardless.

## Semver

We want to use Semver for our version numbers.

Semver means "semantic versioning".
It's a way of making those version numbers actually mean something.
The [semver.org](http://semver.org/) site summarizes the practice extremely well:

Given a version number MAJOR.MINOR.PATCH, increment the:

- MAJOR version when you make incompatible API changes,
- MINOR version when you add functionality in a backwards-compatible manner, and
- PATCH version when you make backwards-compatible bug fixes.

## Releasing New Versions

Pull Requsts should never touch package.json version.
Some excited contributors might include a version bump for you in their Pull Request,
but it's best to discourage contributors from doing that.

Instead, decide on your own when it's best to release a new version.
You may want to group several changes into a single release.

### 1. Bump Version

When you are ready to release a new version,
follow the Semver rules to determine what the new version number should be.
Modify your package.json file to use that new version.

### 2. Update Changelog

I also keep a changelog on important projects.
Modify your changelog to include the new version
and the major changes made in it.
I've been using a format like so, that I enjoy:

    1.2.3
    -----
    - [#51](http://github.com/someorg/someproject/pull/51) added some crazy new endpoint

This allows the viewer to go directly to the pull request where that change was made.
The context provided by this is invaluable.

### 3. Publish New Version

Run your `npm publish` and look for successful output.

### 4. Commit Published Version

Your local changes so far should be
(1) the version bump in package.json and
(2) the updates to the changelog.
Commit these changes with a message like "published 1.2.3".
This makes it clear in your commit history where specific versions were released.

### 5. Tag Release

Create a tag for the current release for easy git retrieval.


    git tag -a v1.2.3 -m "tagged 1.2.3"
    git push --tags


Later, if you ever want to get the code at an exact version, just use `git checkout v1.2.3`!

### 6. Loop Back to Pull Requests

Now that everything is ready to be used,
go back to each Pull Request included in the recent release.
Add a comment to each of them specifying which version they were included.

This allows viewers of the Pull Request easy reference to which version they need (or higher)
in order to use the features described in the Pull Request.

## Automation

You can, of course, automate most of the steps here.
I think it's important to know what the steps are
and how you would do them by hand.
However, I do not think it's important to do them by hand every time.
Once you understand them, automate them with your favorite task runner
(bash, rake, cake, grunt, whatever) and move on!

You can use the npm [version](https://npmjs.org/doc/cli/npm-version.html) command
to automate steps 1, 4, and 5.
Determine which part of the version number you want to increase (major, minor, patch),
then use that in the command, like so: `npm version major -m "publish version %s"`.
When using this command, `%s` will be replaced with the new version number.

## How does this all help?

I've found that following these steps leads to
a cleaner system to investigate when something goes wrong.
It should be pretty easy to track down a change,
find what version where it was introduced,
and start working on the fix.
