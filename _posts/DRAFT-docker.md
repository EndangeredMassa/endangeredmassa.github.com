# Developing NodeOS with Docker

[NodeOS](http://node-os.com) is new OS
(or linux distro, if you prefer that term)
that aims to bring the power of npm
to system-level package management.
[Atwood's Law](http://www.codinghorror.com/blog/2007/07/the-principle-of-least-power.html) 
ensured that 
npm was already full of
the tools we will need
to compose an OS.

[Docker](https://www.docker.io)
is a tool that allows you to build
entire systems inside linux containers
based on tags in a history system,
not unlike git.

## A Look into NodeOS

Docker allows us to construct an OS
in a series of layers.

![NodeOS Breakdown](images/nodeos_breakdown.png)

The Dockerfiles that define these layers
are available in the
[repository](https://github.com/NodeOS/NodeOS-Docker).

[Layer 1](https://github.com/NodeOS/NodeOS-Docker/tree/master/Layer1-linux)
includes the construction of a basic linux file system
and the necessary files
for that basic linux system to get started.<br>
[Layer 2](https://github.com/NodeOS/NodeOS-Docker/tree/master/Layer2-nodejs)
pulls in Node.js.<br>
[Layer 3](https://github.com/NodeOS/NodeOS-Docker/tree/master/Layer3-base)
brings in
the core global modules
that will allow NodeOS
to get things done beyond simply booting.<br>
[Layer 4](https://github.com/NodeOS/NodeOS-Docker/tree/master/Layer4-custom)
expands on those modules
with some nice-to-haves.

These layer definitions make it
easy to know where you should modify
some part of the build.
They also allow users to branch off of any layer
and do their own work from there.
For example, if you wanted to take Layer 1
and pull in Java instead of Node.js,
you could start on your own Android-inspired
system.

For NodeOS work, you will most likely want to
customize Layer 4 to provide more
default packages and 
a custom start command.

## Building on Top of NodeOS

I started
[my own customization of NodeOS](https://github.com/EndangeredMassa/massa-os)
in order to play with different packages.

To do this yourself,
you need your own Dockerfile that looks like:

```
FROM nodeos/base

ENV HOME /root
ENV PATH /root/bin:/usr/bin:/usr/sbin:/bin:/sbin

ENTRYPOINT ["init"]

MAINTAINER Sean Massa <endangeredmassa@gmail.com>

RUN npkg install bin-nsh
RUN npkg install bin-man
RUN npkg install bin-fs
RUN npkg install bin-pwd
RUN npkg install bin-ifconfig

RUN npkg install hipster@0.15.3
RUN npkg install boxes

CMD ["boxes"]
```

This creates an image based on `nodeos/base`,
which is the Layer 3 image.
It is essentially a fork of
the example Layer 4 definition.
The only real difference is that
`hipster` (text editor)
and `boxes` (terminal UI)
are installed
and the initial command is `boxes`
instead of `nsh` (the NodeOS shell).

This means that starting this custom NodeOS
will boot directly into
[boxes](https://github.com/EndangeredMassa/boxes),
which is my terminal window manager.

https://github.com/EndangeredMassa/massa-os/blob/master/Makefile

