---
layout: post
title: "Backbone Best Practices"
author: Sean Massa
categories: [dev]
blurb:
  
published: false
---





## views

If your view is getting too large,
you can usually break it up into some subviews.
Don't let your entire app run in a single view.

### initialize

No view's initialize method should call render.
Don't do it.
This means that you'll have code like:

```coffee
view = new OrderView
view.render()
```

And that's just fine.
It makes it much easier to test, reuse, and otherwise manage.

If you want something more concrete,
a good reason to decouple initialization and rendering
is a view's root element might be bound later with
[setElement](http://backbonejs.org/#View-setElement) rather than at initialization,
which is extremely useful for composable views.

### managing jQuery usage

No view is allowed to use the global `$` function.
It can only use `@$`,
which scopes it to the view's `@el`.
This ensures that views are only concerned with their own domain.
If a view needs to affect some other part of the page,
use a global event bus to broadcast messages.

### view manager

Since views cannot use the global `$` function,
at some point something has to
tell your views where in the document they should go.
This should be a module, typically called a ViewManager.
This module will be the only thing in your entire app
that is allowed to access the `window.document` via the global `$` function.

For simpler single-page apps,
a simple view manager like this may suffice:

```coffee
class ViewManager
  show: (view) ->
    if @currentView?
      # or whatever other cleanup logic
      @currentView.remove()

    @currentView = view
    @currentView.render()

    $("#content").html(@currentView.el)
```

For more complex apps,
you may want a more complex view manager:

```coffee
class ViewManager
  constructor: (@$container) ->
    @views = []
  
  show: (view) ->
    @remove(oldView) for oldView in @views
    @views = [view]
  
    view.render()
    @$container.html(view.el)
  
  prepend: (view) ->
    @views.unshift(view)
    view.render()
    @$container.prepend(view.el)
  
  remove: (view) ->
    return if !(view in @views)
  
    @views = _.without(@views, view)
    # or whatever other cleanup logic
    view.remove()
```

### render

Render methods DO NOT append their `@el` to the DOM.
That's the job of the parent view.
If you are the highest-level view,
use a view manager (see above) to place the `view.el`.
This increases testability by removing the document dependency from the view itself.
Since we never touch the actual `window.document`,
testing backbone views becomes quick and easy.
When we render a view,
it populates its own `@el`
and we test against that directly with `@el.find('selector')`.

Render methods should defer to a `toHtml` method to generate the actual html.
A typical render method looks like:

```
render: ->
  @$el.html(@toHtml(@template, @model.attributes))
```

# toHtml

The toHtml method should be called by the render method.
It should accept a context object (usually `model.attributes`)
and a template (unless you store that in an instance variable)
and return the generated html or jQuery equivalent.

A toHtml method typically looks like:

```coffee
toHtml: (template, data) ->
  templateEngine(template, data)

render: ->
  newContent = @toHtml(@template, @model.attributes)
  @$el.html(newContent)
```

This segregates your template engine to its own method,
leaving the render method unaware of those details.

## presenters

Presenters are very useful for separating presentation logic from templates.
The presenter should stand between the model and the view,
presenting a version of the model to the template engine.

A typical presenter looks like:

```coffee
class OrderPresenter
  initialize: (@order) ->
  toHash: ->
    orderId: @order.id
    completedAt: formatDate(@order.completedAt)

# ...

render: ->
  presentedModel = (new OrderPresenter(@model.attributes)).toHash()
  newContent = @toHtml(@template, presentedModel)
  @$el.html(newContent)
```

There is some debate about whether or not the presenter should be a method or a class.
Given how we typically use them,
they should probably be a method,
but there are cases where you might want to use them as a class.

## there's more to life than backbone

Backbone provides a structure for you
to create Views, Models, Collections, and Routers.
However, not every module needs to be a subclass of these bases.

There are times when a simple hash will suffice instead of a Model,
or an array of values instead of a Collection.
Don't jump straight to using the Backbone class without making sure you need it.

Remote server access also may not require a Model or Collection.
Just because it's an ajax call,
that doesn't mean you have to shoehorn it into a Backbone module.
Sometimes you'll want to create your own module
for making these calls and that's OK.
This is especially true if the remote resource doesn't adhere to REST.

The only thing that really should
(almost) always be a Backbone module is any DOM creation.
The first thought for showing something to the user should be Backbone.View,
then you can evaluate if it's really necessary.

## fat arrow

This isn't necessarily CoffeeScript-specific,
although it's far easier in CoffeeScript.

When creating a module like a Backbone.View,
it's hard to think of a situation where you
want to call a method on that module under a different context.
This is typically handled by passing a third parameter
to any event binding of `this`, like so:

```coffee
initialize: ->
  this.model.on('change', @render, this)

render: ->
  # do stuff
```

Another common practice is to enforce all methods to execute in the scope of the view, which you can do with bindAll.

```coffee
initialize: ->
  _.bindAll(this, 'render')

render: ->
  # do stuff
```

But both of these patterns require
a bit more typing per method on your module.

Because it's so common to want to preserve
the context in which a method is defined,
as opposed to the context in which it is called,
an alternative and preferred pattern is
to always fat-arrow your method definitions in a module.

```coffee
initialize: => # not strictly necessary here, but nice for consistency
  # `this` not required
  # _.bindAll not required
  this.model.on('change', @render)

render: => # note the =>
  # do stuff
```

Elsewhere, you should still use `->` or `=>`, whichever makes sense.
But for module-level methods,
always using fat-arrow seems like a good idea.

## testing

If you are following the rest of these guidlines,
testing views should be easier.
Typical tests look like:

```coffee
# testing rendered view on view.$el
it 'can be success', ->                                                                                                                                                                                                            
  view = new FlashView
    type: 'success'
  view.render()
  expect(view.$el.hasClass('success')).toBe(true)
```

Notice how we don't have to mess with `#jasmine_content`
because our view only cares about its own `@el`.
We also don't worry about fixtures thanks to client-side templates.

## conclusion

