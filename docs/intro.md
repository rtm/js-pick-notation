# Doing more with dot notation

Dot notation is the JavaScript feature that lets you pull properties out of objects:

    o.p

This takes the property with the name `p` from the object `o`.
Even JavaScript beginners are familiar with this basic notation.
It's important because so much of JavaScript programming is about objects and their properties.

Often, we want to create new objects with some, but not all, properties from another object.
Let's say we our object `o` has many properties, including `p1` and `p2`.
Now we want to create a new object with just these two properties.
Usually, we'd write

    {p1: o.p1, p2: o.p2}

With the new extended dot notation, instead we can write:

    o.{p1, p2}

Notice we've written a left curly bracket after the dot.
Normally, this would be a syntax error.
With extended dot notation, it means to take (or "pick") `p1` and `p2` from the object to the left of the dot.

What are the advantages to this?
It's shorter.
We have to write out  `o`, `p1`, and `p2` just once, rather than twice.
That reduces the chances for typos.
It's easier to read and see what is happening.

### What about the `o[name]` syntax?

JavaScript also allows us to refer to properties by using their name,
with the square bracket syntax:

    o[name1]

This refers to the property of `o` whose key is given by the value of the variable `name1`.
If we wanted to create an object with two properties given by `name1` and `name2`, currently we'd write:

    var o2 = {};
    o2[name1] = o[name1];
    o2[name2] = o[name2];

Or, using the syntax called "computed properties names", we could also write:

    {[name1]: o[name1], [name2]: o[name2]}

With extended dot notation, we can simply write

    o.{(name1), (name2)}

The parentheses around `(name)` tell the system that this is an expression to be evaluated,
instead of a plain old literal property name.

### Using the new extended dot notation to build arrays

It's common to want to create an array with values picked from an object.
Let's say we want to create an array with the values of properties `p1` and `p2` from `o`.
currently we would have to write:

    [o.p1, o.p2]

With extended dot notation, we can write square brackets after the dot
(which again, currently would be a syntax error).
This means to create an array with the picked values.
So we can write

    o.[p1, p2]

### Defaults

It's common in JS to want to pick a property from an object,
but not know whether that property exists or not.
If it does not exist, then we want to give it a default value.
Currently, we would usually write something like

    {p1: o.p1 || 42, p2: o.p2}

but this will given `p1` the value `42` not only if `p1` is missing from `o`,
but also if it's present but has a falsy value.
To ensure the default is applied only when the property is really missing,
we'd have to write something like

    {p1: o.p1 !== undefined ? o.p1 : 42, p2: o.p2}

But this will get tiresome quickly.
With extended dot notation, we can supply the default using an equal sign after the property name, so:

    o.{p1 = 42, p2}

### Renaming properties

Sometimes we want to pick a property from one object into a new object,
but give the property a new name.
Say we want to pick `p1` but rename if `new_p1`.
Currently we'd write

    {new_p1: o.p1}

With extended dot notation,
we can specify a new name using the `as` notation, as follows:

    o.{p1 as new_p1}

We can combine this with defaults, so

    o.{p1 as new_p1 = 42}

### Picking from arrays

We've seen how to pick **into** arrays--in other words, create arrays from picked values-- using the `.[]` notation,
but what about picking **from** arrays?
Nothing much changes, but of course instead of property names we will be giving indexes into the array.
Let's say we want to create a new array with the first and last elements of some array.
Normally we would have to write

    [a[0], a[a.length-1]]

Using extended dot notation,
the first element we just specify as `0`, of course.
The last element we can conveniently specify as `-1` (negative indexes count back from the end of the array).
So we can write

    a.[0, -1]

When picking from arrays, we can also give a **range** of indexes, using the `to` notation.
So to pick the `n` elements from the beginning of the array, we can write

    a.[0 to n]

This is the same as `slice` but perhaps a bit more readable.

### Picking into values

So far we've only talked about picking into objects and arrays.
Sometimes, however, we want to pick into a value.
For example, to simply find the last element of an array:

    a.(-1)

### Other features

Extended dot notation has many other features.
See the spec for details.
Here's a sampler:

 1. Use the `all` notation (`*`) to refer to all other properties or array elements.

 1. Specify that properties must be present using `!`, or must not be present using `^`, or should not be picked using `~`.

 1. Specify properties based on a regular expression. For instance, pick all the properties starting with `p` by saying `o.{/^p/}`.

 1. Create "pick functions" with a unary dot. For instance, the function `.p1` picks the `p1` property from its parameter.
