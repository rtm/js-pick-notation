# The JavaScript "Pick"  Operator

This document proposes a "pick" operator for JavaScript.
In a nutshell, the pick operator allows deconstruction into objects, rather than variables.
It is represented by the sharp sign.

This proposal does not offer new functionality.
It is intended to allow common cases for object property manipulation to be written more succinctly.


### Simple example

Create an object containing the values of the `a` and `b` properties from object `o`:

    o2 = {a, b} # o1;          // o2 = {a: o1.a, b: o1.b}

Support defaults and renaming:

    o2 = {p1: q1 = d1, p2: q1 = d2} # o1;


## Motivation

Some meaningful portion of JS written today is concerned with manipulating and extracting properties from objects.

The representative case is to create an object with two properties from another object.
Today we would write this as:

    { p1: o.p1, p2: o.p2 }

In other words, creating a new object containing properties `p1` and `p2` drawn from `o`.
This is commonly referred to as "picking".
However, the syntax above has several drawbacks:

 1. `o`, `p1` and `p2` all must be repeated. This makes the construct is wordy and prone to typos.

 1. The JS interpreter might have to retrieve `o` twice, a potential efficiency concern.

 1. There is no easy way to short-circuit the property access if `o` is not an object.

 1. Nor is there any easy way to specify defaults if `p1` is not present on `o`.

### Underscore and other libraries

Underscore and other utility libraries have validated the importance of property arithmetic with APIs such as `_.pick`.
We will not discuss it further other than to say it does requires providing quoted property names,
cannot rename properteis as they are picked,
cannot specify defaults,
and cannot pick deeply.
Underscore also supports `_.omit` which is kind of an inverse `_.pick`,
which suffers from the same shortcomings.
Underscore offers other property-related APIs include `_.matcher`, to check property existence.

Other libraries have also acknolwedged the importance of pick-like operations.
For instance, Ember has `Ember.Object#getProperties`.

### Picking with destructuring assignment

ES6 does support picking-related functionality in the form of destructuring assignment.
We write

    let { p1, p2 } = o;

The fundamental limitation of this feature is that **it is limited to picking into variables**.
If I want to create an object with properties `p1` and `p2` from another object, I must write

    var { p1, p2 } = o;
    var pickedObj = { p1, p2 };

This gives us defaults, renaming, and deep picking, but the property names must still be written out twice.

We could write

    (({p1, p2}) => ({p1, p2}))(o)

Using parameter destructuring, but this seems more trouble than it's worth,
and the properties must still be written out twice.


### Summary

Common property arithmetric operations used in JS are currently overly wordy.
This proposal is motivated by the desire to write such operations in a way that is more compact and readable.


## Basics

Our proposed solution to the motivations above is based on a new operator, the pick operator.
A primary use of the pick operator is to pick properties from an object into an object.

    { p1, p2 } # o

This yields an object with the two properties `p1` and `p2` taken from `o`.

### Renaming

We borrow some concepts used in restructuring assignments to provide renaming:

    { p1: q1, p2 } # o   // {q1: o.p1, p2: o.p2 }

### Default values

We use the `=` syntax to provide default values in case the `p1` property is missing from `o`:

    { p1 = 42, p2 } # o


### Existential handling

The pick operator is defined to return undefined when picking against a non-object, so that either

    { p1 } # 0

returns an empty object with no further ado.

A mechanism described later is available to insist that we are picking from a proper object,
or that the property exists.


### Deep picking

We can deep pick as follows.
Assuming `o = { p1: 1, p2: { p21: 21, p22: 22 } }`, we could write

    { p1, {p22} # p2 } # o

To maintain the structure of the original object while picking from subobjects we write:

    { p1, p2: { p21 } } # o  // {q1: o.p1, p2: o.p2.p21}


### Picking properties from objects into values

We can also pick from objects into values, as in

    p # o

With a default value, to be parseable, this requires writing

    (p = 42) # o

### Picking from objects into variables

We can pick a property into a variable,
using a "pick assignment":

    a #= o;               // let a = o.a; or let {a} = o;

Similarly to picking into a variable, to support default values, we need

    (a = 42) #= o;

or to declare at the same time

    var (a = 42) #= o;

We can pick multiple values with the "variable picklist" described below:

    var (a, b) #= o;


## Pickers

The basic form of a "pick" is

    picker #[=] object

In this section, we describe the basic form of the left hand side, the picker.
A picker is one of a simple picker, an object picklist or a variable picklist.
An alternative "array" picker is described in the extensions section of this document.

### Simple pickers

A **simple picker** has the following syntax.

    key[modifier] [= default]

This results in a value calculated as the value of the property given by `key` taken from the right-hand object,
with the default value applied if the key is missing or the object is defective.
`modifier` is described below.

### Subpickers

Another form of the simple picker is the **subpicker** mentioned above, which has the form

    picker # pick

which means to take the result of `pick`, and then pick from from it using `picker`.
This allows us to say

    { a # b, c # d } # { b: { a: 1 }, d: { c: 2 } }      // { a: 1, c: 2 }

Subpickers can be any number of levels deep:

    { a # b # c } # { c: { b: { a: 99 } } }              // { a: 99 }

The picker on the left side of a subpicker can be a picklist,
to allow picking of multiple properties from an intermediate pick.

    { (a, b) # c } # { c: { a: 1, b: 2 } }               // { a : 1, b : 2 }


### Picklists

A picklist is one of the following.

 1. an object-like construct containing pickers (**object picklist**), used to pick properties into an object

 1. a parenthesized list of pickers, used in assignments (**variable picklist**), used to pick properties into variables, or pick multiple properties in a subpicker

In addition, an "array picklist" is described in the extensions sections at the bottom of the document.


### Spreads in picklists

In object picklists and array picklists, we support an empty spread operator in the final position. It refers to "remaining" properties.

    { a: x, ... } # o      // { x: o.a, p1: o.p1, p2: o.p2, ... }


### Computed pickers and other exotica

To pick a property whose name is given by an expression, we borrow the computed property name syntax and write:

    [propname] # o            // o[propname]

The computed property name can of course be an expression:

    [propname.toLowerCase()] # o

If the expression inside the `[]` evaluates to an array, it means all the names in the array:

    propnames = [ 'p1', 'p2' ]
    { [propnames] } # o       // { p1: o.p1, p2: o.p2 }

If the expression inside the `[]` evaluates to an object, its keys are used as the properties to be picked:

    propobj = { p1: 1, p2: 2 }
    { [propobj] } # o         // { p1: o.p1, p2: o.p2 }

If the picker is a regular expression, it yields all matching property names:

    { [/^p/] } # o             // { p1: o.p1, p2: o.p2 }

A function given as a pickname acts as a filter on property names:

    { [p => /2/.test(p)] } # o // { p2: o.p2 }

We can rename properties based on an expression using the following syntax:

    { p: [newname] } # o    // { [newname]: o.p }

We can rename properties, including multiple ones, by giving a function following the colon.
The function is invoked with the property name, and must return a string.

    { /^p/: p => p.replace('p', 'q' } # { p1: 1, p2: 2 }   // { q1: 1, q2: 2 }


### Mandatory and disallowed picking

We use the exclamation mark to indicate that a key specified in a picker *must* exist,
otherwise a ReferenceError is thrown.

    p! # o                    // { p: o.p }; throws if p is missing

The mandatory operator and a default specifier are mutually exclusive.


We use the caret to indicate that a key specified in a picker *must not* exist.

    (p, q^) # o               // { p: o.p }; throws if o.q is present

and can specify its default if desired, which will always be used.

    (p, q^ = 99) # o               // { p: o.p, q: 99 }; throws if q is present

We can check that all desired keys, given as an array of strings, exist:

    { [keys]! } # o

and to add a check that no other keys exist:

    { [keys]!, ...^ } # o

Check that no key starts with `q`:

    { [/^q/]^ } # o


## Pick assignment

Picking has an obvious relationship to deconstructing assignments, of the form

    { p } = o;

To generalize and enhance deconstruction, we propose a **pick assignment operator** `#=`, as in

    p #= o;                     // p = o.p;, or { p } = o

Multiple pickers (target variables) can be specified by providing a parenthesized list called a **variable picklist**:

    ( p1, p2 ) #= o;            // p1 = o.p1; p2 = o.p2; or, { p1, p2 } = o;

or to also declare the variables:

    let ( p1, p2 ) #= o;        // let p1 = o.p1, p2 = o.p2; or, let { p1, p2 } = o;

Like all pickers, the picker on the left side of `#=` could include defaults and renamers, so

    (p: x = 42) #= o;

means to find the `p` property in `o`, or use 42 if it is not present, and assign the result to `x`.

The left hand operand of the pick assignment operator must be a simple picker, or a variable picklist.
It is meaningless to assign to an array or object.

      p   #= o   // assign o.p to variable p
    ( p ) #= o   // same as above
    { p } #= o   // syntax error
    [ p ] #= o   // syntax error


## Extensions

### Array extensions

The picking notion can optionally be extended to work with arrays.

#### Picking from objects into arrays

We might want to pick one or more properties into an array:

    [ p1, p2 ] # o        // [ o.p1, o.p2 ]

#### Picking from arrays

We might want to pick from an array instead of an object using an **array pick** operator,
for which we could use `@`:

    { a, b } @ [ 1, 2 ]  // { a: 1, b: 2 }

### Array picklists

The notion of picklist is extended to include **array picklist**", an array-like construct containing pickers.


## Picking from arrays: the array pick operator

To pick from arrays, we introduce the **array pick operator** `@`, analogous to `#`:

    { a, b } @ array      // { a: array[0], b: array[1] }

A single picker is the equivalent of `head`:

    a @ array

When picking from arrays, when the LHS is a picklist,
the order of pickers corresponds to the order of elements in the array,
with the normal convention of being able to elide elements:

    { a, , b } @ array    // { a: array[0], b: array[2] }

We can pick from an array onto an array:

    [ 1, 0 ] @ array

### Array pick assignment

We can declare/assign using the **array pick assignment operator**, '@=':

    let (a, b) @= array;

The equivalent of today's `[a, b] = [b, a];` is

    (a, b) @= [b, a];

The power of this syntax is demonstrated by this example. Given an array of sort indexes, we can apply it using

    [ indexes* ] @= array


### Picking from arguments

Currently function arguments can be deconstructed as follows:

    function f({ a }) { }

The equivalent using pick notation is to use the pick (or array pick) operator,
with *no right operand*.
The right operand is implicitly the argument in that position in the argument list, so

    function f(a #) { }
    f({a: 1})

corresponds to the above. Similarly, we can deconstruct array arguments with

    function f((a, b) @) { }
    f([1, 2])

or pick out nested properties:

    function f(c # b #) { }
    f({ b: { c: 1 } })

We can give defaults and do renaming.

    function f(c: x = 42 # b #) { }


## Grammar

### Operators

| Operator | Meaning |
|:-------- |:-------- |
| #        | pick     |
| #=       | pick assignment |
| @        | array pick |
| ?@       | maybe array pick |
| @=       | array pick assignment |
| -------- | -------- |

### Pickers

| Syntax   | Name | Meaning |
|:-------- |:---- |:------- |
| a        | simple picker | pick property `a` |
| a!       | mandatory picker | pick property `a`, throw if missing |
| a^       | disallow picker | throw if property `a` is present |
| [a]      | computed picker | pick property with key given by value of `a` |
| a = 42   | picker with default | pick property `a` with default |
| b: a     | picker with rename | pick property `b` and rename to `a` |
| b: a = 42 | picker with rename and default | pick property `b` and rename to `a`, defaulting to 42 |
| b: fn    | picker with functional rename | pick property `b` and rename with result of calling fn |
| b: [a]    | picker with computed rename | pick property `b` and rename with value of `a` |
| /regexp/ | regexp picker | pick properties matching regexp |
| fn       | filter picker | pick properties passing filter |
| ...      | spread picker | pick remaining properties/elements |
| a # b    | subpicker     | pick `a` from the result of picking `b` |
| { a, b } | object picklist | pick into object |
| [ a, b ] | array picklist | pick into arary |
| ( a, b ) | variable picklist | pick into variables (assignment only), or pick multiple properties in a subpicker |
| -------- | -------- | -------|

## Revision History

| Version  | Date | Content |
|:-------- |:---- |:------- |
| 0.1      | 2015-06-20 | Change rename to use `:`. Remove "this pickers". Change maybe pick to `?#`. |
| 0.2      | 2016-02-04 | Remove maybe picking. Move arrays to later section. |
| -------- | -------- | -------|
