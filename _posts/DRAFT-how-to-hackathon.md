---
layout: post
title: How to Hackathon
author: Sean Massa
categories: [dev]
blurb:
  I gave a presentation about
  [how to have a successful hackathon](https://docs.google.com/presentation/d/1s5OHHfzlmzhXp7hthjjHD7fREj2xavI3MZ6c9Q9D0aE/edit?usp=sharing)
  at Chicago Node.js.
  This is the blog post version!
published: false
---

Below are my points of advice for anyone participating in a hackathon.
This information draws on my experience
of many hackathons in previous years.
I learned from most of these mistakes myself.

A lot of these suggestions will apply to new or in-progress projects
regardless of hackathons.

## Preparation

**Know the Rules**:
These things have rules
and it's very important to know what they are.
Read the rules in full.
There are often suggestions or requirements in the rules
that you had not considered.

**Develop Your Idea**:
If allowed, come up with your idea ahead of time.
Spend time before the event coming up with a plan of attack.
This can include learning libraries or tools ahead of time.

**Have an Event Goal**:
All of your work during the event should be prioritized toward some event goal.
Before the event, you need to know what that event goal is.
It could be to win the entire hackathon,
win a specific category,
to build something just so that it exists,
or to have fun.
Whatever it is, figure it out before you start!


## Execution

**Use a Project Template**:
You don't want to waste time at the start of the event setting up your dev environment.
Find a project template that you like, or create your own, and use it!
Here are a few starting points:
[coffeescript-project](https://github.com/michaelficarra/coffeescript-project),
[expressjs](http://expressjs.com/guide.html#executable),
[html5builerplate](http://html5boilerplate.com).

**Deploy First, Then Often**:
One of the first things you should do after the event starts
is to test your project in production.
Set up a quick response mechanism (like a route for a web server),
deploy it, and make sure it can respond properly.
You don't want to get most of the way through the event
and realize that the deploy system doesn't work as advertised.

**Git [or similar] Like Crazy**:
Pick your [DVCS](http://en.wikipedia.org/wiki/Distributed_revision_control)
ahead of time.
Make sure you know how to use it.
For git, that means knowing how to work with: commits, branches, merge/rebase, and revert.

**Don’t Ignore Architecture**:
You are never going too fast to skip spending time
on thinking about the architecture of your feature.
The short-term focus of hackathons will often lead to many bugs.
You can protect yourself from bad architecture decisions
by spending some actual time thinking about it first.

**Prioritize All Work**:
For everything that you do,
ask yourself if it is the best thing you can do right now
to complete your project's minimum viable product (MVP).
Your MVP can shift throughout the event,
but each feature you start should be compared against it.

**Use Existing Libraries**:
There are times where you will want to rewrite some functionality
because it will be easier "your way".
For hackathons, I urge you to work through
whatever trouble you have with the existing solutions
and focus on what you should be building.

**Don’t Necessarily Ignore TDD**:
If you normally practice TDD,
don't assume that it has no place in hackathons.
Just like normal projects,
you should decide where it makes sense
for you to TDD and where it doesn't.
The difference here is that the line is in a different place.
It's hard to provide any hard rules here,
but you should be mindful of the situation.
Make sure your template project has you
set up to write tests if you choose to.

**Don’t Ignore Meatspace**:
For short 24-48 bursts,
some people consider skipping meals and sleep,
sometimes with the help of caffeine.
I am definitely guilty of this in the past.
However, it never seems to provide much benefit.
You may accomplish some work overnight,
but people who do this are often much less capable
to help with problems that will arise at the very end of the event.
You will know your own body better than me,
but you should consider planning for
some amount of sleep during the event.

**Schedule Distractions**:
Remove real-time distractions (IM, email, etc.)
that can interrupt you during work.
You should also take real breaks away from your work
to allow your subconscious to continue working on the problem
while you take care of some physical need.

**Pair Appropriately**:
Pair programming is incredibly helpful in general.
Try to pair often during hackathons.
The bug count is already going to be higher than normal.
Use that second pair of eyes to help keep it down.

**Avoid New Accounts**:
If you are making an app that requires user accounts in some way,
either also allow guest accounts or
allow social media account connections.
People are lazy.
If they have to sign up for an account to look at your app,
they might just skip it.

**Support Multiple Users**:
If your app requires multiple users to showcase its core concepts,
it can be hard for people to judge it.
If you can build even a naive AI or small seed data set,
the judges will be able to experience your app properly.
You can also schedule times where judges can use your app
with the developers (and possibly other users).

**Leave Time for Testing**:
The last couple of hours before the end of a hackathon are always hectic.
Schedule at least two hours leading up to the end
in order to test, debug, and polish your app.


## Reflection

**Record a Demo**:
In some cases, like Node Knockout,
you are allowed to record a video demo of your app.
If this is at all allowed, you should do it.
It saves you from failed demos due to bugs.
Make sure that the video shows the best case scenario,
skips trivial things like account creation,
and is quick, but informative.

**Talk About It**:
Recalling this experience will help you
learn from and internalize it.
You should do this however you feel comfortable.
That can be blogging,
discussing the event at a meetup or the IRC room,
or just quietly thinking about the experience to yourself.

## Core Advice

The `tl;dr` of it all, inconveniently at the end, is this:

* take care of your body
* always have a goal
* always prioritize work toward goal

Leave your suggestions below!
