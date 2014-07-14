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
Now we have the power to
compose those modules
into an actual operating system!

## A Look into NodeOS

[Docker](https://www.docker.io)
allows us to construct an OS
in a series of layers.
Check out the awesome
[Docker tutorial](https://www.docker.io/gettingstarted)
for more information
on how that works.

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
easy to work on a specific
level of the overall system
independently of levels above it.
They also allow users to branch off of any layer
and do their own work from there.
For example, if you wanted to take Layer 1
and pull in Java instead of Node.js,
you could start on your own
Android-like system.

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
(my terminal-based window manager)
instead of `nsh` (the NodeOS shell).

This means that starting this custom NodeOS
will boot directly into
[boxes](https://github.com/EndangeredMassa/boxes).

To run this, you need to build the docker image specified by this Dockerfile, then start the image.

```bash
# build an image called `myos`
# based on the Dockerfile
# in the current `.` directory
docker build --tag myos .

# run the image called `myos`
docker run --tty --interactive myos
```

You should see a lot of output
when docker builds the image,
but then you should see
the boxes window manager!

If you try the commands again,
you will notice that
it goes much quicker the second time.
That's because docker cached
the file system state
based on the commands
in the Dockerfile.
If you add a command to the Dockerfile,
everything from that command
to the end will be re-run
based on the cached file system state
up to that point in the Dockerfile.


## Iteration

Iteration on your custom NodeOS
can be made easier with
[a simple Makefile](https://github.com/EndangeredMassa/massa-os/blob/master/Makefile).


```makefile
build:
	docker build --tag myos .

run: build
	docker run --tty --interactive myos

link: build
	docker run --tty --interactive \
	--volume /home/#{YOUR_USER}/nodeos:/host:ro \
	myos
```

This will allow you
to run `make run`
to fire up your docker instance
based on your current Dockerfile.
`make link` will do the same,
but also mount the path provided
inside the docker instance at `/host`. 
Linking makes it useful
for developing modules
you want to use
inside a docker instance.

For example,
you can make changes to your project
on your host system,
run `make link`,
navigate to your container's linked directory
`/host/#{project}`,
and test your code.


## Public Registry

Once you are ready to share your image
with the world, you can upload it
to the official docker registry.

After
[setting up an account](https://www.docker.io/account/signup/),
you can:

```bash
sudo docker login
sudo docker commit #{container_id} #{user_name}/#{image_name}
sudo docker push #{user_name}/#{image_name}
```

Then someone else can test your image with:

```bash
docker pull #{user_name}/#{image_name}
docker run --tty --interactive #{user_name}/#{image_name}
```

## working with Docker and NodeOS

Building an OS with Docker feels great!
It's one of the most interesting uses of
docker that I've seen so far.

NodeOS itself has some very interesting problems and capabilities.
Using npm at a system level is very compelling.

I'm excited about the future of both of these great technologies.