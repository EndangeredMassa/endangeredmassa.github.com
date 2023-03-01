---
layout: post
title:  "Conventional Comments: Streamlining Feedback"
date:   2022-03-15
description:
  "How I use Conventional Comments to make it clear (1) what kind of comment it is, (2) what specifically I want, and (3) how important it is that my comment is resolved."
---

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
> 
> When I tested analyzing temporary failures, the URL for next always seemed to exist and be the same across all subsequent polls. I ended up having to check whether `items.length === 0` (`events.length === 0`) instead to break out of the loop.

> **suggestion (non-blocking):** extract functions
> 
> In the model hooks especially, I suggest extracting functions aggressively. This makes it easier to see each concept that happens as the result of a hook.
> 
> What do you think about something like this?
> 
> ```
> beforeCreate: async function(model, options) {
>     ensureEmailMxDomain(model);
>     ensureLatLong(model);
> }
> ```

> **convention (blocking):** use `last_email_interaction_at`
> 
> Our convention for database column names says that dates should end in `_at`.
> 
> I marked this as “blocking” because migrations are expensive and risky in this database. We should minimize the number of migrations where possible.

> **requirement (blocking):** invert conditional `if (found)` should be `if (!found)`
> 
> It looks like the code and test are accidentally checking that the file was found, but I think here we expect the file to not be found.

# Takeaways

This structure makes it clear to others what needs to be done. It's also a good forcing function for the author to consider the feedback they provide more carefully.

The best part is that readers don't have to know about the structure to understand feedback written in this style.

# Related Topics

See [Detangling the Code Review](./detangling-the-code-review) for details about different kinds of feedback.
