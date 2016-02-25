# Proposal for JavaScript pick notation (extended dot notation)

### Executive summary

This document proposes an extension to the JavaScript dot notation.
Currently, dot notation only allows an identifier to follow the dot,
meaning to retrieve the value of key with that name.

This proposal extends the dot notation to allow curly-bracketed, square-bracketed, or parenthesized constructs
following the dot, allowing properties to be extracted from the expression preceding the dot
into a new object, array, or value.

The curly-bracketed or square-bracketed constructs function very similarly to the
constructs used in destructuring assignment,
and resemble the *AssignmentPattern*
construct used in destructuring assignment (but with some differences and important extensions).
This is not surprising, because this proposal is about a kind of destructuring,
not into variables as with destructuring assignment,
but into objects, arrays, and values.

This proposal does not offer new functionality.
It is intended to allow common cases for property access and manipulation to be written more succinctly.

An alternative to this proposal uses a new operator such as `#` instead of the extended dot.
See the section below on this topic for pros and cons.


### Real simple example

Create an object containing the values of the `a` and `b` properties from object `o`:

    o2 = o1.{a, b};          // o2 = {a: o1.a, b: o1.b}

Support defaults and renaming:

    o2 = o1.{p1 as q1 = d1};   // o2 = {q1: o.p1};

## Motivation

Some meaningful portion of JS written today is concerned with manipulating and extracting properties from objects.

The representative case is to create an object with properties from another object.
Today we would write this as:

    { p1: o.p1, p2: o.p2 }

In other words, creating a new object containing properties `p1` and `p2` drawn from `o`.
This is commonly referred to as "picking".
However, the syntax above has several drawbacks:

 1. `o`, `p1` and `p2` all must be repeated. This makes the construct wordy and prone to typos.

 1. The JS interpreter might have to retrieve `o` twice, a potential efficiency concern.

 1. There is no easy way to short-circuit the property access if `o` is not an object.

 1. Nor is there any easy way to specify defaults if `p1` is not present on `o`.

### Underscore and other libraries

Underscore and other utility libraries have validated the importance of property arithmetic with APIs such as `_.pick`.
We will not discuss this further other than to say it has the drawbacks that it
requires providing quoted property names,
cannot rename properties as they are picked,
cannot specify defaults,
and cannot pick deeply.
Underscore also supports `_.omit` which is kind of an inverse `_.pick`,
which suffers from the same shortcomings.
Underscore offers other property-related APIs include `_.matcher`, to check property existence.
Other libraries have also acknolwedged the importance of pick-like operations.

### How is this different from destructuring?

ES6 does support picking-related functionality in the form of destructuring assignment.
We write

    let { p1, p2 } = o;

The fundamental limitation of this feature is that **it is limited to destructuring into variables**.
If I want to create an object with properties `p1` and `p2` from another object, I must write

    let { p1, p2 } = o;
    let pickedObj = { p1, p2 };

This gives us defaults, renaming, and deep picking, but the property names must still be written out twice.

### Summary of Motivation

> Common property arithmetic operations used in JS are currently overly wordy.
This proposal is motivated by the desire to write such operations in a way that is more compact and readable.


## Basics

Our proposed solution to the motivations above is to extend the dot notation,
to take, on its right-hand side, a curly-bracketed construct which
specifies the properties to take from the object.

    o.{p1, p2}

This yields an object with the two properties `p1` and `p2` taken from `o`.

The right-hand side may also be a square-bracketed construct (which results in an array),
or a parenthesized construct (which results in a value).

### Renaming

The ability found in destructuring assignments
to specify new property names with colons (*DestructuringAssignmentTarget*) is supported,
with the `as` notation.

    o.{p1 as q1}   // {q1: o.p1}

### Default values

The syntax used in destructuring assignments
to specify default values with equal signs (*Initializer*) is unchanged.

    o.{p1 = 42}
    o.(a = 42)

### Existential handling

The dot notation when followed by a picker construct is defined to return undefined when picking against a non-object,
so that

    null.{p1}

returns an empty object with no further ado.

Mechanisms described later are available to insist that we are picking from a proper object,
or that the property exists.


### Deep picking

To deep pick,
assuming `o = { p1: 1, p2: { p21: 21, p22: 22 } }`,
we can deep pick from inside the nested object with

    o.{p1, p2.p22}                 // {p1: 1, p22: 22}

To leave the sub-object in place, but apply picking to it,
using renaming in this case:

    o.{p1, p2: {p21 as p21_new}}   // {p1: 1, p21_new: 21}


### Picking properties into values

We can also pick from objects into values,
by placing picking information in a parenthesized construct after the dot.

    o.(p)

This is exactly the same as `o.p`, but also allows us to provide a default value:

    o.(p = 42)

Since `p` by itself would be a literal key, to provide the key in a variable or expression we write:

    o.((p))

The inner set of parenthese forces this to be an expression to be evaluated.
This is of course identical to just `o[p]`,
but provides the ability to specify defaults and picktypes (see below).


### Other problems to be solved

This proposal provides solutions to two other issues the ES community has been discussing:

 1. Taking the last element of an array. This can be done now with `a.(-1)`.

1. Null propagation. In this proposal, `a.(b).(c)` propagates nulls by default. To explicitly check for nulls (and throw),
use the "must" picktype, as in `a.(b).(c!)`.


## Syntax overview

### Picks

We call the entire syntactic construct a "pick".
There are three basic forms.

Picking from objects:

* Pick into object (`object.{ picker, ... }`)
* Pick into array  (`object.[ picker, ... ]`)
* Pick into value  (`object.(picker)`)

In addition, there are guarded forms of the pick,
are represented by `.?`.

#### Unary forms

An important part of this proposal is the introduction of dot notation with no left-hand side.
The pick operator comes in unary and binary forms.
The examples above show the versions with the left-hand side.
The unary form creates a **pick function**,
which may be applied against an object by calling it, as in

    var pick = .{a};
    pick(o)              // equivalent to o #{ a } (which is {a: o.a})

This allows picks to be passed around as first-class objects:

    myfunc(data, .a);    // pass a pick function to retrieve the property 'a'

    function myfunc(data, picker) { return picker(data); }

#### Picking into arrays

When picking into arrays, each element of the resulting array is
taken from the corresponding element of the list of pickers, so

    {b:1, a:2}.[a, b]     // yields [2, 1]

We will now build the definition of "picker" from the bottom up,
starting with the notion of **key**..

### Key

A key, which is all you may need in many cases, is one of the following.

#### Literal key

    a    // literal key 'a'
    'a'  // literal key 'a'

Array picks (remember, we use this term to refer to picking **from** arrays)
use integral keys, with negative values counting from the end of the array.

#### Expression as key

We can also specify a key or keys using a variable.
To distinguish it from a literal key, make it an expression by enclosing it in parens:

    (a)   // key given by evaluating `a`

It would be nice if we could use `[a]` for this,
mimicking the syntax for computed property values,
but stealing this array-like format prevents us from implementing some other desirable features.

The expression could also evaluate to an array, object, regexp, or function.
If an array, it means all the strings in the array as keys.
If an object, it means all the keys in the object.
If a regexp, it means all keys matching the regexp.
If a function, it is treated as a pick function to do further picking.

#### Rest

In addition, there is the "all" pseudo-key, written as `*`.
This refers to all keys (which haven't been mentioned yet).

For example, we can pick an object's values into an array with:

    object.[*]

#### Ranges

There is also a range key, useful in array arithmetic, which has the syntax `key to key`.

For example, we can reverse an array with

    a.[-1 to 0]

#### Picktypes

A key can be suffixed with one or more **picktypes**.
These are single characters which describe how the picking should be done:

| Picktype  | Name | Description |
| ------------- | ------------- | ----------- |
| `!`  | must  | key must be present |
| `~`  | omit  | key is to be omitted |
| `^`  | mustnot  | key must not be present |

For instance:

    o.{p!}                  // { p: o.p }; throws if p is missing

The caret indicates that the key(s) *must not* exist.

    o.(p, q^)               // { p: o.p }; throws if o.q is present

Since picktypes can be applied to keys,
we can check that all desired keys,
given as an array of strings, exist:

    o.{(keys)!}

or that no other keys than `a` exist:

    o.{a, *^}

or that no key starts with `q`, or that at least one key does:

    o.{/^q/^}
    o.{/^q/!}

We can omit a single property by combining the `~` picktype with all:

o.{a~, *}

#### Pickgroups as keys (advanced)

There are times when we want to group pickers in order to apply behavior such as "must",
or a renaming function, or a default, to all of the keys within the group.
This can be accomplished by enclosing them in curly braces.
For example:

    o.{{a, b}!}

Indicates that both `a and `b` are mandatory. Another example:

    var x = o.<|a, b!|>

This assigns property `a` from object `o` to variable `x`,
while also insisting that property `b` be present.

Pick groups may also be used to subpick some properties from multiple object-valued properties:

    o.{{|a, b}:{c}}

The above picks the property `c` from both `o.a` and `o.b`, yielding

    {a: {c}, b: {c}}


### Picker

A **picker** is a key with an optional renamer and/or default.

    key [as newkey] [= default]

This takes the value given by key from the RHS,
but renames it to `newkey`, which is usually just a key.
But it can also be an expression evaluating to a key, or a function providing a renaming rule.
When picking into arrays, the `newkey` is an integer index that says where in the array the value is to placed.

We use `as` for renaming instead of `:`,
because we need to retain `:` to refer to object-valued property values (see below).

The **default** is an expression which is used if the key is missing or the object is defective.
The special syntax `:= default` is used to provide a function to provide a default rule.

### Advanced topic: nested picking and picker composition

We need to distinguish between two types of nested picking.
In the first, we want to pick a value "out of" an object-valued or array-valued property.
For instance, from `o = {a: {b1: 1, b2: 2}}`, we want to pick `{b1: 1}`.
The syntax for this is `o.{a.b1}`.
We call this "deep picking".

In the second, we want to pick the subobject, but then do further picking inside it.
The syntax here would be `o.{a:{b1}`,
and would result in `{a: {b1: 1}}`.
We call this "nested picking".
To rename both `a` and `b1`, the relevant syntax would be:

    o.{a as newa :{b1 as newb1}}

which would result in

    {newa: {newb1: 1}}}

#### Pick functions

A picker may be a pick function.
We can use this notion to create "nested pickers".

    .picker1.picker2

which means to take the result of picking from the object using `picker1`,
then pick from that using `picker2`.

This allows us to say

    { b: { a: 1 } }.{.b .a}      // { a : 1 }

Since picks are functions, they may be composed:

    var picka = .a;
    var pickb = .b;
    {a: 1, b: 2}.{(picka), (pickb)}

Subpickers can also be used to apply picktypes, defaults or renamers to multiple properties:

    .{.{a, b}! : p => p+"prop"}

Flatten an array:

    [[1, 2], [3, 4]] .[*.*]

Clone an object two levels deep:

{a: {a1: 1, a2: 2}, b: {b1: 3, b2: 4}} .{*: {*}}


### Future issues

How to specify a default as another property value from the same object?


## BNF Syntax

In the below, `identifier` and `expression` have their JS meanings.

```
# Keys
<basicKey>           ::= <identifier> | <expression>
<key>                ::= <key> | "*" | <key> "..." <key>
<picktype>           ::= "!" | "~" | "^"
<typedKey>           ::= <key> [<picktype>...]
<picker>             ::= <typedKey> [":" <basicKey>] [["!"] ["="] <expression>]

# Picks
<objectPick>         ::= "{" <picker>, ... "}"
<arrayPick>          ::= "[" <picker>, ... "]"
<pick>               ::= <objectPick> | <arrayPick> | <valuePick>

# Pick operators
<pickOperator>       ::= "." | ".?"
<pick>               ::= expression <pickOperator> <pick>
<pickFunction        ::= <pickOperator> <pick>
```

## Which notation, dot or hash?

We also considered using a new notation, possibly the hash mark,
in lieu of the extended dot notation.
Both alternatives have advantages and disadvantages.
The advantages of using the dot are:

1. Extending the dot does not use up a precious symbol/operator.

2. If the notation is intended to be usable in unary/prefix style,
the dot is less visible and a potential footgun.

3. Semantically, picking is very close to what the dot notation currently does.
That would suggest extending the dot is better.

4. Using the hash allows value picks without following parentheses,
so we can write `a#-1` instead of having to write `a.(-1)`.

The POC implementation provides both versions as `pick-dot.sjs` and `pick-hash.sjs`.

## Revision History

| Version  | Date | Content |
|:-------- |:---- |:------- |
| 0.5      | 2016-02-09 | Massive revamping. Picker is now on right of `#`. |
| 0.6      | 2016-02-11 | Swap `#` to `.`. }
