---
layout: post
title:  "An Incremental Approach to Linting to Your Projects"
date:   2017-07-12
---

I have gone through the process of adding linting to existing, large projects a couple of times. I've learned some lessons about how to approach this so that it's not disruptive to the team doing other work. Follow these steps to get robust linting into your project without pulling team velocity to a halt!


# What's So Great About Linting?

The really great benefits to code linting are that it:

- fixes potential bugs
- removes unnecessary code
- enforces internal coding style
- (optionally) enforces community coding style

Consistency of code removes the need to make decisions (individually and as a team) about hundreds of small things where the actual decision doesn't necessarily matter, but having a decision is valuable. With linting, your team can have those conversations once, then enforce them throughout the life of the project. And yes, those can change over time, but it's much easier to update a rule and fix all of the violations at once!

It can also be valuable to adopt coding styles shared by a larger community. Your language, framework, or tools' communities will have their own conventions. Aligning with those can help alliviate friction when a developer switches context between internal and external code as well as when a developer changes jobs internally or externally.


# How Do I Get Started?

### Collect Existing Conventions

You may already have a styleguide or a set of explicit or implicit conventions. Whatever you already have in place, document it as preparation for a Code Convention team meeting. Don't worry, we'll only have one meeting in this process!


### Discuss Conventions
  
Take those notes to a team meeting to talk about what the conventions are and what you'd like them to be. Try to stick to higher-level issues (indentation, spacing, keyword use) rather than every single possible decision.

Your conventions will directly and indirectly inform many linting rules, but there are far too many of them to have the team agree on every single one. Starting with a solid base set of rules will allow you to (1) make fewer decisions and (2) leave your team room to make decisions where it matters to them. See the last section for my personal recommendations on linting tools and configurations.


### Enforce Passing Conventions

One tool or ruleset at a time, install and configure it to run. Ideally, integrate this into your build process and test suite.

You will probably see a lot of linting failures at this point. Go through the list and disable all rules where there is at least one falure. Now you should see no failures. Keep a list somewhere of which rules are turned off because they fail (as opposed to turned off because you disagree with them). We'll need those later!

Commit this and submit it for review. What you have now is a set of rules that are enforced and all currently pass linting check as well as a TO DO list of rules to turn on. This should be low-impact to the team while still enforcing the linting rules you were already following.


### Fix Failing Conventions

One (or a few related) rule(s) at a time, enable the rules and fix all of the failures. Some tools like eslint will fix some of the failures for you (`eslint . --fix`).

Submit the changes for review. Team members can disagree and have a conversation in the pull request, but hopefully the earlier discussions make this uncommon.

Repeat this step until all rules are back on!


# The Result

We now have a process for incremental maitenance work that we can do in small chunks to improve the state of the code. As long as your team has the appropriate slack time dedicated to maintenance, you'll get through all of this work in no time!


# I Want More!

There are a lot of great linters out there. Here's a list to get you started!

- [eslint](http://eslint.org/) (with [eslint:recommended](http://eslint.org/docs/user-guide/configuring#using-eslintrecommended))
  - [airbnb-base](https://github.com/airbnb/javascript)
  - [eslint-plugin-import](https://github.com/benmosher/eslint-plugin-import)
  - [others...](https://www.npmjs.com/browse/keyword/eslint)

- ember
  - [ember-cli-eslint](https://github.com/ember-cli/ember-cli-eslint)
  - [ember-cli-template-lint](https://github.com/rwjblue/ember-cli-template-lint)
  - [ember-cli-scss-lint](https://github.com/tomasbasham/ember-cli-scss-lint)

- [sass lint](https://github.com/sasstools/sass-lint)

Happy linting!
