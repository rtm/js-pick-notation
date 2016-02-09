# The JavaScript "Pick"  Operator

This document proposes a "pick" operator for JavaScript.
In a nutshell, the pick operator allows deconstruction into objects,
rather than variables
(although it also does more).
It is represented by the sharp sign **`#`**.

This proposal does not offer new functionality.
It is intended to allow common cases for property access and manipulation to be written more succinctly.


### Real simple example

Create an object containing the values of the `a` and `b` properties from object `o`:

    o2 = o1 #{a, b};          // o2 = {a: o1.a, b: o1.b}

Support defaults and renaming:

    o2 = o1 #{p1: q1 = d1};   // o2 = {q1: o.p1};


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

### But don't we already have destructuring?

ES6 does support picking-related functionality in the form of destructuring assignment.
We write

    let { p1, p2 } = o;

The fundamental limitation of this feature is that **it is limited to picking into variables**.
If I want to create an object with properties `p1` and `p2` from another object, I must write

    var { p1, p2 } = o;
    var pickedObj = { p1, p2 };

This gives us defaults, renaming, and deep picking, but the property names must still be written out twice.

### Summary of Motivation

> Common property arithmetic operations used in JS are currently overly wordy.
This proposal is motivated by the desire to write such operations in a way that is more compact and readable.


## Basics

Our proposed solution to the motivations above is based on a new operator, the pick operator (`#`).
A primary use of the pick operator is to pick properties from an object into an object.

    o #{ p1, p2 }

This yields an object with the two properties `p1` and `p2` taken from `o`.

### Renaming

We borrow some concepts used in restructuring assignments to provide renaming, using a colon:

    o #{ p1: q1, p2 }   // {q1: o.p1, p2: o.p2 }

### Default values

We use the `=` syntax to provide default values in case the `p1` property is missing from `o`:

    o #{ p1 = 42, p2 }
    o #a = 42

### Existential handling

The pick operator is defined to return undefined when picking against a non-object, so that

    { p1 } #null

returns an empty object with no further ado.

Mechanisms described later are available to insist that we are picking from a proper object,
or that the property exists.


### Deep picking

We can deep pick as follows.
Assuming `o = { p1: 1, p2: { p21: 21, p22: 22 } }`, we could write

    o #{ p1, # p2 # p22 }     // {p1: 1, p22: 22}


### Picking properties into values

We can also pick from objects into values, as in

    o #p             // o.p

With a default value:

    o #p = 42

Since `p` by itself would be a literal key, to provide the key in a variable or expression we write:

   o #(p)


## Syntax overview

### Picks

We call the entire syntactic construct a "pick".
There are three basic forms.

Picking from objects:

* Pick into object (`object #{ picker, ... }`)
* Pick into array  (`object #[ picker, ... ]`)
* Pick into value  (`object #picker`)

In addition, there are guarded forms of the pick,
are represented by `#?`.

#### Unary forms

The pick operator comes in unary and binary forms.
The examples above show the binary form.
The unary form creates a **pick function**,
which may be applied against an object by calling it, as in

    var pick = #{ a };
    pick(o)              // equivalent to o #{ a } (which is {a: o.a})

This allows picks to be passed around as first-class objects:

    myfunc(data, #a);    // pass a pick function to retrieve the property 'a'

    function myfunc(data, picker) { return picker(data); }

#### Picking into arrays

When picking into arrays, each element of the resulting array is
taken from the corresponding element of the list of pickers, so

    {b:1, a:2} @[a, b]     // yields [2, 1]

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

In addition, there is the "rest" pseudo-key, written as `...`.
This refers to keys which haven't been mentioned yet.

For example, we can pick an object's values into an array with:

    object #[ ... ]

#### Ranges

There is also a range key, useful in array arithmetic, which has the syntax `key to key`.

For example, we can reverse an array with

    a @-1 to 0

#### Picktypes

A key can be suffixed with one or more **picktypes**.
These are single characters which describe how the picking should be done:

| Picktype  | Name | Description |
| ------------- | ------------- | ----------- |
| `!`  | must  | key must be present |
| `~`  | omit  | key is to be omitted |
| `^`  | mustnot  | key must not be present |

For instance:

    o #{ p! }                // { p: o.p }; throws if p is missing

The caret indicates that the key(s) *must not* exist.

    o #(p, q^)               // { p: o.p }; throws if o.q is present

Since picktypes can be applied to keys,
we can check that all desired keys,
given as an array of strings, exist:

    o #{ (keys)! }

or that no other keys than `a` exist:

    o #{ a, ...^ }

or that no key starts with `q`, or that at least one key does:

    o #{ /^q/^ }
    o #{ /^q/! }

We can omit a single property by combining the `~` picktype with rest:

    o #{ a~, ... }


### Picker

A **picker** is a key with an optional renamer and/or default.

    key [: newkey] [= default]

This takes the value given by key from the RHS,
but renames it to `newkey`, which is usually just a key.
But it can also be an expression evaluating to a key, or a functi providing a renaming rule.
When picking into arrays, the `newkey` is an integer index that says where in the array the value is to placed.

The **default** is an expression which is used if the key is missing or the object is defective.
The special syntax `:= default` is used to provide a function to provide a default rule.

### Nested pickers and picker composition

A picker may be a pick function.
We can use this notion to create "nested pickers".

    #picker1 #picker2

which means to take the result of picking from the object using `picker1`,
then pick from that using `picker2`.

This allows us to say

    { b: { a: 1 } } #{#b #a}      // { a : 1 }

Nested pickers can be any number of levels deep:

    { c: { b: { a: 99 } } } #{c #b #a}    // { a: 99 }

Since picks are functions, they may be composed:

    var picka = #a;
    var pickb = #b;
    {a: 1, b: 2} #{(picka), (pickb)}


## BNF Syntax

In the below, `identifier` and `expression` have their JS meanings.

```
# Keys
<basicKey>           ::= <identifier> | <expression>
<key>                ::= <key> | "..." | <key> "to" <key>
<picktype>           ::= "!" | "~" | "^"
<typedKey>           ::= <key> [<picktype>...]
<picker>             ::= <typedKey> [":" <basicKey>] [["!"] ["="] <expression>]

# Picks
<objectPick>         ::= "{" <picker>, ... "}"
<arrayPick>          ::= "[" <picker>, ... "]"
<valuePick>          ::= <picker>
<pick>               ::= <objectPick> | <arrayPick> | <valuePick>

# Pick operators
<pickOperator>       ::= "#" | "#?"
<pick>               ::= expression <pickOperator> <pick>
<pickFunction        ::= <pickOperator> <pick>
```

## Revision History

| Version  | Date | Content |
|:-------- |:---- |:------- |
| 0.5      | 2016-02-09 | Massive revamping. Picker is now on right of `#`. |
