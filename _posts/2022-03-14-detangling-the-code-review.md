---
layout: post
title:  "Detangling the Code Review: Questions, Preferences, Suggestions, Conventions, Requirements"
date:   2022-03-14
description:
  "Teams can have more effective code reviews if they default to approval and have a framework for delivering and managing feedback."
---

# Responsibility

As a team member, you have the following responsibilities to your teammates regard code reviews:

- respond to code review requests within half a business day with your review or a note about needing more time
- review code with compassion and respect
- review code thoroughly, thinking through possible impacts and edge cases
- after approving code, you take on a share of the responsibility for that code operating correctly in production

As a code change author requesting review, you have the following responsibilities:

- drive progress on the code review being merged
- find appropriate reviewers for your code change
- make your code easy to review
    - submit smaller code changes, when possible
    - write detailed descriptions of why your changes were made in review requests
- respond quickly to feedback

# Understanding Code Review Comments

**Your goal is to approve the code change if at all possible.** This builds momentum, shows progress, and even in cases where the author needs to make a change, allows their original contribution to be impactful.

There are different types of Code Reviews comments:

- **Questions** are simply that, questions about the code change. They can vary in severity.
- **Preferences** are personal, non-functional tweaks to the code.
- **Suggestions** are alternate, functional ways to fulfill the requirements. Ideally they come with some reasoning or pros/cons.
- **Conventions** are project- or team-based rules to follow. They work best if they are automatically enforceable. That way, no human has to comment about these issues.
- **Requirements** are what needs to be done for the code to accomplish its purpose. The code change must meet its requirements.

**Question Comments**

Sometimes you need more context. Question Comments are a great place to ask for more information because others may have the same question and/or the answer may add context that other reviewers can use.

When asking questions, make it clear how important it is to get an answer. You may have a mild curiosity or a serious concern.

*Blocking?* If you need to know the answer because you consider the code change to meet the requirements, block merging. Otherwise, do not block merging.

**Preference Comments**

There’s a time and place for discussing preferences in a codebase, but that’s not during Code Review. When reviewing code, focus on correctness instead.

When you want to discuss code preferences, bring it up during existing team meetings or schedule a new meeting to discuss this.

All of these are preferences, not facts about what’s best, in most programming languages:

- where to put optional spaces before/after other syntax
- indentation value (tabs/2-space/4-space)
- anything else that’s not pointing out a failure to meet a Convention or Requirement

*Blocking?* If you insist on commenting with a preference, it should never block merging the code change.

**Suggestion Comments**

When the code change meets the requirements, but it could do so *better* in some way, you can comment with a suggestion. If the code change meets the requirements in theory, but in practice there will still be significant problems, then it’s still a Requirements Comment.

All Suggestion Comments should clearly describe what the suggested code change is, why it’s better, and why it might be worse.

This is the fuzziest type of comment because complexity and human judgement creep in. You could suggest a code change because the original code would be slow (for a certain definition) and the suggested change is faster. But maybe that code is only ever run on a handful of items in a place where some delay would be fine, anyway. Is it worth making the code faster? Is the faster code harder to read? Maybe we’re not making the right tradeoff in this case.

Be mindful of the pros and cons of each approach when making Suggestion Comments.

*Blocking?* If the suggestion is an alternative approach that is debatably better, do not block merging. If the suggested code change is significantly better (in your opinion), recommend that they adopt it now or submit a new code change immediately after.

**Convention Comments**

There are authoring rules that programmers should follow when working in a given codebase that are based on (1) what currently exists in that codebase and (2) agreed-upon rules of the team that owns that codebase.

As many of these as possible should be automatically enforced in the CI test suite. These tests should be runnable in local development environments as well. Ideally, these are also checked in real-time in the dev’s editor. Linting is the most common example of automating this, but it can include performance tests, generative tests, and more.

Not all conventions will be automatable. These are often related to naming variables and functions.

Code Review should only include comments on conventions when they are not automatable. Even then, they should never be blocking comments. Conventions can always be cleaned up immediately after merging a code change that breaks them without affecting the functionality of the system.

Preferences can become Conventions after discussing the issue with the team. These are best batched into infrequent discussions to avoid Convention thrashing.

*Blocking?* If you are commenting about a failure to meet a Convention, it should rarely block merging the code change. You can recommended they submit a new code change immediately after to remedy the convention violation.

**Requirements Comments**

There are absolute requirements for a given task for which a code change is made. The code change must fulfill those requirements without introducing new bugs.

If the code change meets the requirements in theory, but in practice there will still be significant problems, then you should still consider your comment to be a Requirements Comment.

*Blocking?* Failure to meet requirements or introducing new bugs are the only guaranteed way to block a code change from being merged.

**Flexibility**

This structure gives you a shared set of language and expectations to make code review a more efficient process.

However, there is room for flexibility. When the site is down, feel free to toss these ideas out the window. When you have a good reason to deviate from this, just explain way.

# Code Review Framework: Conventional Comments

The idea behind [Conventional Comments](https://conventionalcomments.org/) on Code Reviews is that structure can convey a lot meaning quickly.

This process helps convey understanding of:

- what change is suggested
- why it matters
- how important it is to change now

You can use the process [as documented by the author](https://conventionalcomments.org/), but I like using the following the following customized version.

## Streamlined Conventional Comments

All comments must be resolved before merging, but resolution can look different for different kinds of comments.

All comments are also non-blocking unless otherwise specified.

### Format

```jsx
<label> ([blocking-status]): <subject>

[details]
```

- label: this is a single label that signifies what kind of comment (see above) is being left:
    - question
    - preference
    - suggestion
    - convention
    - requirement
- blocking-status (optional)
    - (blank): does not block merging
    - non-blocking: does not block merging
    - soft-blocking: does not block merging, but the comment should be resolved in a follow-up code change
    - blocking: blocks merging
- subject: brief and explicit description, no need for padded language
- details (optional): the context, reasoning, and conversational messaging

## Examples

> **question (non-blocking):** Were you able to find a case when `paging.next` doesn't exist?

When I tested analyzing temporary failures, the URL for next always seemed to exist and be the same across all subsequent polls. I ended up having to check whether `items.length === 0` (`events.length === 0`) instead to break out of the loop.
> 

> **suggestion (non-blocking):** extract functions

In the model hooks especially, I suggest extracting functions aggressively. This makes it easier to see each concept that happens as the result of a hook.

What do you think about something like this?

```
beforeCreate: async function(model, options) {
    ensureEmailMxDomain(model);
    ensureLatLong(model);
}
```
> 

> **convention (blocking):** use `last_email_interaction_at`

Our convention for database column names says that dates should end in `_at`.

I marked this as “blocking” because migrations are expensive and risky in this database. We should minimize the number of migrations where possible.
> 

> **requirement (blocking):** invert conditional `if (found)` should be `if (!found)`

It looks like the code and test are accidentally checking that the file was found, but I think here we expect the file to not be found.
> 

# Takeaways

The type of comment (Preference, Convention, Suggestion, or Requirement) should lead to whether or not resolution of that comment should block merging the code change:

- Preference: non-blocking; don’t comment with this unless you can’t help yourself
- Suggestion: non-blocking or soft-blocking
- Convention: soft-blocking
- Requirement: blocking

However feedback on code changes is provided, they should be communicated with compassion. You should consider how your comments will be received based on team context and experience level of the author. Dr. McKayla goes into much more detail on [compassionate code review](https://www.michaelagreiler.com/respectful-constructive-code-review-feedback/).
