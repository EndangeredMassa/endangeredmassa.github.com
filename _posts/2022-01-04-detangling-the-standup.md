---
layout: post
title:  "Detangling the Standup: Status Reports, Team Planning, Context Sharing, and Community Building"
date:   2021-11-18
description:
  "Standups are often applied without understanding the problem they are solving. This leads to:

  1. Not clearly solving a specific problem
  2. Not solving a problem with the best solution
  3. A daily interruption to deep work

  What follows is a pragmatic and ideal approach to resolving this situation. The pragmatic approach is to understand so you can excel within that system. The ideal solution tries to change the system to better serve the team."
---

The most common problems that Standups are solving:

| Problem | One Solution | Typically Called |
| --- | --- | --- |
| unclear project or task status | Status Report meetings | Standup |
| inefficient team collaboration | Team Planning meetings | Standup |
| unclear team problems and/or solutions | Context Sharing meetings | Standup |
| team member silos or other lacks of communication | Community Building meetings | Standup |

Standups are often applied without understanding the problem they are solving. This leads to:

1. Not clearly solving a specific problem
2. Not solving a problem with the best solution
3. A daily interruption to deep work

What follows is a pragmatic and ideal approach to resolving this situation. The pragmatic approach is to understand so you can excel within that system. The ideal solution tries to change the system to better serve the team.

Note that the value of each process will vary by team composition and project management strategies.

- Remote (similar time zones) vs. Remote (various time zones) vs in-person
- Cross-functional vs function-specific
- More vs. less experienced
- Kanban vs. Sprint vs. Project vs. Waterfall styles

# Pragmatic Approach

Figure out what kind of standup you have will help you understand its purpose. That will help you accept the value it provides, even if it’s not for you.

You can then try to fulfill that purpose to the best of your ability.

**Status Report “Standups”**

Individual contributions to these meetings focus on what was done, what’s on track (or not), and what’s up next. They are generally less useful to the individual contributors on a team.

These contributions are most useful to the team lead and/or stakeholders to understand the status of the project.

> Yesterday I was working on the “Sign In With Google” story, but hit a weird issue with the integration. I spent a few hours debugging it. I should finish it this morning. Today, I’ll finish that story and pick up the next one.
> 

**Context Sharing “Standups”**

Individual contributions to these meetings focus on what was done, how, and/or why. They include specifics.

These contributions are generally more useful to the individual contributors on a team. They are less useful to the team lead.

> Yesterday I was working on the “Sign In With Google” story, but hit a weird issue with the integration. I spent a few hours debugging it. Turns out, the documentation was wrong about how to differentiate between bad credentials and bad integration.

In my debugging, I built up a wrapper component that smooths over the confusing parts and more clearly validates inputs based on our needs. Make sure you use it in our other apps if you need to implement Google sign in.
> 

**Community Building “Standups”**

Individual contributions to these meetings pay lip service to the premise of a “Standup”, but spend a non-trivial amount of time on socializing.

These contributions may feel like a waste of time, but are likely useful to all team members. This kind of meeting can build the team community.

> Yesterday I was working on the “Sign In With Google” story and I’ll keep working on it today.

Last night I took my kids to a trampoline park for the first time. It was bonkers, but a lot of fun. I ended up jumping just as much as the kids.
> 

**Team Planning “Standups”**

Individual contributions to these meetings focus on what needs to be done, especially before/after/together with other team members today or in the very near future.

These contributions are generally more useful to the individual contributors on a team, but the team lead needs to know as well.

> Yesterday I was working on the “Sign In With Google” story, but hit a weird issue with the integration. I spent a few hours debugging it. I’m still not sure what the problem is. Can someone pair with me on this today, ideally this morning?
> 

# Ideal Approach

The best approach to tackling the Standup confusion is to make a list of these kinds of problems, decide if your team has any of those problems (solved for, or not), then ensure you have good solutions for the problems your team has.

For example, say your team has a Status Report “Standup”. You would break out the problems:

| Potential Problem | We Have Problem? | Current Solution |
| --- | --- | --- |
| unclear project or task status | yes | Status Report “Standup” |
| unclear team problems and/or solutions | no | N/A |
| team member silos or other lacks of communication | yes | MISSING |
| inefficient team collaboration | no | N/A |

In this example, you believe that your team only really has two (of these) problems that need solving: “unclear project or task status” and “team member silos or other lacks of communication”.

The current Status Report “Standup” is solving the “unclear project or task status” problem. If you wanted to get rid of this meeting and solve that problem in another way, you could work with the Project Manager and/or Team Lead to find out why your project management system can’t produce this without a daily update from individual contributors. From there, you could experiment with other solutions that fill that gap.

The problem “team member silos or other lacks of communication” is not being solved at all! You could propose that the team schedule other meetings with this explicit purpose. Or, if you want to expand the current “Standup”, you could make socializing an explicit part of that meeting.

## Alternate Solutions to “Standups”

If you have these kinds of “Standup”, consider proposing these alternative solutions. 

Almost all of these solutions reduce the number of meetings team members have. The effect of this will vary per person, but in general, it provides more uninterrupted time for deep work.

**Status Reports**

- **Smaller Tasks:** During project planning, break the larger tasks into smaller tasks that can be accomplished individually. Bonus points for making these smaller tasks deployable and valuable to the system or users.
    - *Why It’s Better:* With larger tasks, you can spend a long time on one task with no discernible progress in the project management software. With smaller tasks, you can see (for example) 3 out of 5 smaller tasks for a larger chunk of work in the project management software.
- **More Status Labels:** In your project management software, you may need more statuses that can track where a task is. These could include Deployed to Staging, QA Review, and Ready for Design vs. Ready for Dev.
    - *Why It’s Better:* Detailed status labels can make it clearer to stakeholders what the progress is as well as who’s responsible for moving it forward.
- **Asynchronous Status Reports:** Status reports don’t really need to be made in a synchronous team meeting. Instead, have a rule that status reports be submitted in email or chat every morning.
    - *Why It’s Better:* This provides a similar amount of value to stakeholders and leads without requiring a meeting.

**Team Planning**

- **Smaller Tasks:** During project planning, break the larger tasks into smaller tasks that can be accomplished individually. Bonus points for making these smaller tasks deployable and valuable to the system or users.
    - *Why It’s Better:* If you have larger tasks that have more complex requirements, it is more likely that the task will rely on others’ work in some way. Breaking tasks into smaller pieces makes each individual step less likely to conflict with something else. It also makes it easier to see connections between tasks.
- **Daily Strategy Meetings:** Yes, this is not exactly an alternative to the Team Planning “Standup”, more a refocusing of it. Define the meeting to be about planning the strategy of the day, explicitly.
    - *Why It’s Better:* Instead of spending time on the ceremony of the standup, you are spending time on solving the problem at hand.

**Context Sharing**

- **Asynchronous Communication:** Add more context in pull requests, code comments, documentation, email, and/or chat systems. It’s important to have some team guidelines on when and where to do this. It really shouldn’t (only) be communicated in a meeting.
    - *Why It’s Better:* Context that’s documented in an expected place is far more value for a far longer period of time than spoken briefly in a meeting.
- **Frameworks/Conventions:** You can remove the need for some types of context sharing by establishing conventions or using frameworks.
    - *Why It’s Better:* This allows future solutions to conventionalized problems to not need (1) novel solutions per problem or (2) sharing context of problem-specific solutions.

**Community Building**

- **Augment Standup:** Make it known and acceptable to socialize during Standup. Add an optional question to your format that’s more personal, like “do anything fun recently?”.
    - *Why It’s Better:* Teams often work better if the members have a rapport. This should not be mandated, but should be encouraged.
- **Virtual Breaks:** Set up specific times (like Tuesdays/Thursdays from 10am - 12pm) where people can join a virtual break room call. People can hang out, work, and/or chat in that space.
    - *Why It’s Better:* Especially for remote teams, it can be easy to feel disconnected from your team. Having time specifically set aside for socializing can make it happen more smoothly.

# Take Away

Standups are not bad, just often misapplied. Understand the problems you need solved and what the best solutions might be. If that’s a standup-style meeting, then go for it. I just don’t think it should be the default.
