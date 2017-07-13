---
layout: post
title:  "The False Fast vs. Well Spectrum"
date:   2017-06-01
---

In the minds of many, there is this concept that you can either work fast or well.
Any time spent doing things better is time spent not shipping.
This is supposedly a rather rigid spectrum.

```

      (fast) +-------------------------------------+ (well)

```

I think that this mental model is ignoring an entire dimension: domain experience.
If we add that into our model, there's a lot more nuance to this characterization.

```

                          (experienced)
                              +-+
                               |
                               |
                               |
                               |
                               |
                               |
                               |
      (fast) +-------------------------------------+ (well)
                               |
                               |
                               |
                               |
                               |
                               |
                               |
                              +-+
                        (inexperienced)

```

The experience you have in the relevant domain is incredibly important to this discussion. It helps us really understand the definitions of both fast and well.

For someone inexperienced in the domain, doing things fast means adding cruft to the system. You don't know how to write decent tests--or even that you should write them at all. You don't consider the structure of your code when you stuff in more conditionals and meandering logic. You don't consider the design of the system when you add a side effect to an existing module.

For someone experienced, it means adding technical debt to the system. Not only do you know how to write decent tests, how to structure code to be legible to future readers, and how to design systems, but you also have experience doing those things and can therefore do them more quickly.




```
                          (experienced)
                              +-+
                               |
                               |
                accrue         |       invest
                technical      |       less
                debt           |       time
                               |
                               |
      (fast) +-------------------------------------+ (well)
                               |
                               |
                accrue         |       invest
                technical      |       more
                cruft          |       time
                               |
                               |
                              +-+
                        (inexperienced)
```





# NOTES


[Technical Debt vs. Cruft](http://docondev.com/blog/2010/10/technical-debt-versus-cruft)


Adding process/tools early is low cost (for experienced professionals) and low value, but later is high cost and value.

For those with less experience in the specific process/tool domain, the initial cost is much higher, making it a pretty rough tradeoff.


Company: role definition, career pathing, project management processes, 

Sensible defaults can provide extreme value over the life of a project/company. 




