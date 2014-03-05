# The War of Sem-Ver

In [a previous post](http://massalabs.com/dev/2013/10/13/managing-a-project.html),
I recommended following the [official semver standard](http://semver.org).
I, however, don't always follow my own advice.
I decided to dig into the spec,
it's usage (especially in the Node.js community),
and the recent change of `npm install --save`
to use `^` (carat ranges)
instead of `~` (tilde ranges)
in order to better educate myself
on this issue.
This article is a summary of my findings.

In [Node v0.10.26 (Stable)](http://blog.nodejs.org/2014/02/18/node-v0-10-26-stable/)
the default behavior of `npm install --save`
[changed](https://github.com/npm/npm/issues/4587)
to use "^0.0.0" instead of "~0.0.0".

For reference, the [semver module](https://github.com/isaacs/node-semver#ranges) describes this change:

- `~1.2.3` matches `>=1.2.3-0 <1.3.0-0` (i.e., "Reasonably close to 1.2.3")
- `^1.2.3` matches `>=1.2.3-0 <2.0.0-0` (i.e., "Compatible with 1.2.3").

This change caused some detailed discussion.
Let's dig into the issues.

## semver campaign

Arguments presented below spawned mostly
from discussion on the
[pull request](https://github.com/npm/npm/issues/4587)
that implemented this change.
Below, when I say "some say ...",
I am usually referring to this thread in general.

This article is intended to be a summary of those arguments,
their rebuttals, and my personal conclusion.
Feel free to read the original discussion
as well for even more context.

### battle of the real world

Many authors of Node.js modules follow the semver spec,
but many others follow an unofficial variant of the spec:
Instead of using minor versions
as backwards compatible feature additions,
the variant followers use it
as a way to imply "less" breaking changes
than a new major version.

Put completely, official semver is:

- MAJOR: backwards-incompatible API changes
- MINOR: backwards-compatible functionality additions
- PATCH: backwards-compatible bug fixes

and the unofficial alternate is:

- MAJOR: backwards-incompatible API changes
- MINOR: possibly backwards-incompatible functionality additions
- PATCH: backwards-compatible bug fixes

**Side note:**
Some suggest that semver doesn't work because it *only* tracks the API and not the output of a module. I believe that the output of a module is *part of* the API, and therefore covered by the semver spec.

I am certainly guilty of
following the alternate form in the past.
There is a tension against bumping major version numbers,
which I believe causes us to shift the significance of
each number down the chain.
This leads to major versions
implying rewrites or reorganizations,
minor versions implying smaller changes,
and patch versions being the only place
where backwards compatibility
is preserved.

Some suggest that we adopt this alternate policy
because that's how it's used in the "real world".
It is certainly tempting to codify
how things are actually happening
in the module ecosystem.
However, I believe this is a mistake.

**Side note:**
Some claim that carat ranges
will force them to use
shrinkwrap in order to protect themselves
from the increased risk of
updates that include more changes.
This is especially a concern
when dealing with packages
that don't follow official semver.
The risk may be higher
with carat ranges than tilde ranges,
but it is still significant with tilde-ranges.
In my opinion, all production code should always use shrinkwrap.
You never want ANY change to your codebase
to happen between testing and deploying.

It implies that (at least) the majority of packages
use this "realistic" version of semver.
That I simply cannot confirm.
It would take a great deal of research
to determine something like that.
Based on my personal experience with the ecosystem
as both a module consumer and author,
I agree that *some* modules work this way.
However, I cannot agree to make a decision
on this matter based on a collection
of personal experiences,
even when empirical data is not available.

We are left wanting for another criteria
to make this decision.
For that, we should look no farther than meaning.
Semver itself is designed to convey
versions with meaning.
The spec says that minor versions
are still backwards compatible.
The alternate says that they can sometimes
break backwards compatibility,
but will do so less than major version changes.
That doesn't inspire me with confidence.

I'd much rather subscribe to a system
that attempts to provide some guarantees
about compatibility than one that simply tells you
about the degree to which you are likely
going to experience breakages in that compatibility.

### battle of different platforms

If your module uses carat ranges,
this creates an implicit dependency on
Node.js 0.10.16+.
If a consumer wants to use a module
where it or its dependents
use carat ranges,
they cannot be using Node.js <0.10.16.

This is an issue that requires consideration,
but remember that Node.js 0.10.16 has been out for months.
It's true that many people are still on Node.js 0.8.*
and the Node.js project still supports 0.8.*,
but that won't last forever.
I think it's time to start moving away from 0.8.* anyway.

That said, a version of 0.8.*
with a fix for this
would not be unwelcome.

### battle on multiple fronts

One of the benefits of promoting carat ranges
is that module authors will be able
to more reasonably support fewer versions
of their modules.

It seems that most modules
do this already--they make bug
and security fixes in their latest
(or latest -1 major) versions.
This change will make that a safer practice.

Even if they do currently apply fixes
to several old versions,
this change will allow them to
do less of that.
Instead, they can focus more
on their latest versions.

**Side note:**
There is also the browser to consider.
When `npm` installs modules,
it will reuse local versions
that match dependency ranges
of multiple dependencies.
If those range matchers use carat ranges,
the same version of a module
can be used for even more parent modules
in your dependency tree.
This allows less total code
to be bundled into a client-side asset,
making it more reasonable
to take advantage of `npm` modules
in client-side code.

### battle before we're ready

The biggest problem with this change,
in my opinion,
is that many important modules
have not yet hit version 1.0.0.
They are definitely not following semver,
but are depended on by thousands of other packages.

Semver says that anything less than 1.0.0
should be considered "initial development".
This means that the
api could change at any time
--there are no commitments.

This new default means that we need to:

1. encourage these projects to update to 1.0.0
2. make sure we continue to use tilde ranges for these projects

### battle of too many majors

Some are afraid that
we'll hit version 42.0.0 quickly
if backwards incompatible changes
are only allowed in major versions.

Semver says that this hesitation is good
--forcing your to consider backwards incompatible changes more carefully.
I agree that that is useful,
but I also think that
we are often too hesitant.

Maybe version 42 is still a bit much
--you don't want to constantly break backwards compatibility
--but I think we should stomach
a few more version 12.0.0s
instead of hundreds of 0.42.0s.

## let there be peace

I think that using carat ranges
as the default behavior
of `--save` is best
for the Node.js module ecosystem.

The fact that the alternate unofficial semver
exists in the wild
doesn't mean we can't influence it.
Node.js modules have already
done a lot to promote semver in general.
Do you remember version numbers meaning
much of anything before using Node.js?

For those using the alternate semver,
this may be troublesome until they adjust.
But the result will be a
stronger Node.js module ecosystem.

Remember that you should be
using shrinkwrap regardless.
You will only see things break
when you update your shrinkwrap
and test your app
before deploying it.
This applies regardless of
tilde and carat ranges.

You can also always
change your range matchers.
This default is there to
nudge the community towards
a "best" practice.

Semver works best if everyone follows it.
Let's promote the official spec.
