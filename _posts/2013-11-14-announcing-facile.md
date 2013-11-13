---
layout: post
title: "Announcing: facile.js 1.0.0"
author: Sean Massa
categories: [dev]
blurb:
  I felt that the "logicless" template engines had too much logic.
  In my desire to purge all logic from templates, I created one
  of the few truly logicless templates.
published: false
---

## facile

Facile is a convention-based template engine
that can be executed either in the browser (using jQuery or zepto)
or on the server (using cheerio).
While other template systems like Mustache
give the developer syntax for explicit conditionals,
enumerations and placeholders for arbitrary logic,
Facile uses simple conventions to achieve the same goals with less code.
This forces that logic outside of the template.

Checkout the full
[README.md](https://github.com/EndangeredMassa/facile.js/blob/master/README.md)
for details.
I just wanted to call out the core concepts here.

## Usage
The facile package is a single function that accepts a template string and a data object:

```
var facile = require("facile"), // only needed in Node.js
    template = "...",
    data = {...},
    output = facile(template, data);
```

Facile will look for DOM ids and classes that match the keys in your data object
and set the DOM elements' text to the data values:

```
var template = '<div id="dog"></div><div class="cat"></div>',
    data = {dog: "woof", cat: "meow"};
facile(template, data);
// returns '<div id="dog">woof</div><div class="cat">meow</div>'
```

When a value in the data object is an array,
Facile will find the container DOM element
that matches the data key
and render its contents for each item in the array.

```
var template = '<ul id="users"><li class="name"></li></ul>',
    data = {users: [
      {name: "Moe"}, 
      {name: "Larry"},
      {name: "Curly"}
    ]};
facile(template, data);
// returns:
// <ul id="users">
//   <li class="name">Moe</li>
//   <li class="name">Larry</li>
//   <li class="name">Curly</li>
// </ul>
```

If you are binding an array of data to a <table> element,
Facile will use the content of the table's <tbody>
as the template for the data object.
This allows you to setup a <thead> without duplicating it.

```
var template = '<table id="users">' +
               '  <thead>' +
               '    <tr><th>Name</th></tr>' +
               '  </thead>' +
               '  <tbody>' +
               '    <tr><td class="name"></td></tr>' +
               '  </tbody>' +
               '</table>',
    data = {users: [
      {name: "Moe"}, 
      {name: "Larry"},
      {name: "Curly"}
    ]};
facile(template, data);
// returns:
// <table id="users">
//   <thead>
//     <tr><th>Name</th></tr>
//   </thead>
//   <tbody>
//     <tr><td class="name">Moe</td></tr>
//     <tr><td class="name">Larry</td></tr>
//     <tr><td class="name">Curly</td></tr>
//   </tbody>
// </table>
```

If the data object has a null value,
the corresponding DOM element will be removed.

```
var template = '<p>Hello!</p><p class="impolite">Take a hike, guy.</p>',
    data = {impolite: null};
facile(template, data);
// returns "<p>Hello!</p>"
```

## conclusion

I have been using facile on and off for about a year.
I'm still not quite sure if I prefer this style
over a simplified mustache usage.

The future facile may see changes to how attribute bindings happen.
I may also look into writing a different templating language
that allows interpolation, but not arbitrary logic
or even iteration.

I think there is more exploration to be done here.
Let me know what you think below!
