# The JavaScript "Pick"  Operator

This document proposes a "pick" operator for JavaScript.
In a nutshell, the pick operator allows deconstruction into objects, rather than variables (although it also does more).
It is represented by the sharp sign.

This proposal does not offer new functionality.
It is intended to allow common cases for object property manipulation to be written more succinctly.


### Real simple example

Create an object containing the values of the `a` and `b` properties from object `o`:

    o2 = {a, b} # o1;          // o2 = {a: o1.a, b: o1.b}

Support defaults and renaming:

    o2 = {p1: q1 = d1, p2: q1 = d2} # o1;


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
cannot rename properteis as they are picked,
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

We could write

    (({p1, p2}) => ({p1, p2}))(o)

Using parameter destructuring, but this seems more trouble than it's worth,
and the properties must still be written out twice.


### Summary of Motivation

Common property arithmetic operations used in JS are currently overly wordy.
This proposal is motivated by the desire to write such operations in a way that is more compact and readable.


## Basics

Our proposed solution to the motivations above is based on a new operator, the pick operator (`#`).
A primary use of the pick operator is to pick properties from an object into an object.

    { p1, p2 } # o

This yields an object with the two properties `p1` and `p2` taken from `o`.

### Renaming

We borrow some concepts used in restructuring assignments to provide renaming, using a colon:

    { p1: q1, p2 } # o   // {q1: o.p1, p2: o.p2 }

### Default values

We use the `=` syntax to provide default values in case the `p1` property is missing from `o`:

    { p1 = 42, p2 } # o


### Existential handling

The pick operator is defined to return undefined when picking against a non-object, so that

    { p1 } # 0

returns an empty object with no further ado.

Mechanisms described later are available to insist that we are picking from a proper object,
or that the property exists.


### Deep picking

We can deep pick as follows.
Assuming `o = { p1: 1, p2: { p21: 21, p22: 22 } }`, we could write

    { p1, p22 # p2 } # o

To maintain the structure of the original object while picking from subobjects we write:

    { p1, p2: { p21 } } # o  // {q1: o.p1, p2: o.p2.p21}


### Picking properties from objects into values

We can also pick from objects into values, as in

    p # o

With a default value, to be parseable, this requires writing

    (p = 42) # o

Since `p` by itself would be a literal key, to provide the key in a variable or expression we write:

   propname* # o

### Picking from objects into variables

We can pick a property into a variable,
using a "pick assignment":

    a #= o;               // a = o.a; or {a} = o;

We can pick multiple values with the "variable picklist" described below:

    var (a, b) #= o;


## Syntax overview

### Picks

We call the entire syntactic construct a "pick".
There are six forms:

Picking from objects:

* Object pick into object (`{ picker, ... } # object`)
* Object pick into array  (`[ picker, ... ] # object`)
* Object pick into value  (`picker # object`)

Picking from arrays:
* Array pick into object (`{ picker, ... } @ array`)
* Array pick into array  (`[ picker, ... ] @ array`)
* Array pick into value  (`picker @ array`)

In addition, there are guarded forms of the pick,
are represented by `#?` and `@?`.

There also assignment variants of picking into values:

* Object pick assignment (`key #= object`)
* Array pick assignment (`key @= object`)

`#` is called the **object pick operator**.
`@` is called the **array pick operator**.
Collectively, they are called **pick operators**.

#### Picking into arrays

When picking into arrays, each element of the resulting array is
taken from the corresponding element of the list of pickers, so

    [a, b] @ {b:1, a:2} # yields [2, 1]

We will build the definition of "picker" from the bottom up,
starting with the notion of **key**..

### Key

A key, which is all you may need in many cases, is one of the following.

    a    // literal key 'a'
    'a'  // literal key 'a'

Array picks use integral keys, with negative values counting from the end of the array.

We can also specify a key or keys using a variable.
To distinguish it from a literal key, make it an expression by enclosing it in parens:

    (a)   // key given by evaluating `a`

The expression could also evaluate to an array, object, regexp, or function.
If an array, it means all the strings in the array as keys.
If an object, it means all the keys in the object.
If a regexp, it means all keys matching the regexp.
If a function, it means all keys satisfying the predicate.

It would be nice if we could use `[a]` for this,
mimicking the syntax for computed property values,
but stealing this array-like format prevents us from implementing some other desirable features.

### Keyset

Keys can be grouped using parentheses.
This can be useful in order to apply picktypes, renamers, and defaults to all of them.
A key by itself is also considered a keyset.

#### Rest keyset

In addition, there is the "rest" keyset, written as `...`.
This refers to keys which haven't been mentioned yet.

We can pick an object's values into an array with:

    [ ... ] # object

#### Ranges

There is also a range keyset, useful in array arithmetic, which has the syntax `key to key`.

For example, we can reverse an array with

    [-1 to 0] @ a

#### Picktypes

A keyset can be suffixed with one or more picktypes.
These are single characters which describe how the picking should be done:

* `+`:   "must". The key(s) must be present).
* `-`:   "omit". The keys are omitted.
* `^`:   "must not" The key(s) must **not** be present.

For instance:

    { p!} # o                 // { p: o.p }; throws if p is missing

The caret indicates that the key(s) *must not* exist.

    (p, q^) # o               // { p: o.p }; throws if o.q is present

Since picktypes can be applied to keysets,
we can check that all desired keys,
given as an array of strings, exist:

    { (keys)! } # o

or that no other keys exist:

    { a, ...^ } # o

or that no key starts with `q`:

    { /^q/^ } # o

We can omit a single property by combining the `-` picktype with rest:

    { a-, ... } # o


### Picker

A **picker** adds a renamer and/or a default to a keyset.

    keyset [: newkey] [= default]

This takes the value given by keyset from the RSH,
but renames it to `newkey`, which is usually just a key.
But it can also be starred to indicate a computed key or renaming function.
When picking into arrays, the `newkey` is an integer index that says where in the array the value is to placed.

The default value is an expression which is used if the key is missing or the object is defective.

### Nested picker

A picker may itself be a form of pick;
this is called a "nested picker".

    picker1 # picker2

which means to take the result of picking from the RHS using `picker2`,
then pick from that using `picker1`.

This allows us to say

    { a # b } # { b: { a: 1 } }      // { a : 1 }

Nexted pickers can be any number of levels deep:

    { a # b # c } # { c: { b: { a: 99 } } }              // { a: 99 }

The picker on the left side of a subpicker can be multi-key (using keysets),
to allow picking of multiple properties from an intermediate pick.

    { (a, b) # c } # { c: { a: 1, b: 2 } }               // { a : 1, b : 2 }


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

For future consideration.

## BNF Syntax

In the below, `identifier`, `stringLiteral`, and `expression` have their JS meanings.

```
# Keys
<key>                ::= identifier | expression
<keyset>             ::= (<key>, ...) | "..." | <key> "to" <key>
<picktype>           ::= "+" | "-" | "^"
<typedKeyset>        ::= <keyset> [<picktype>...]
<picker>             ::= <typedKeyset> [":" <newname>] ["=" <default>]

# Pickers
<objectPicker>       ::= { <picker>, ... }
<arrayPicker>        ::= [ <picker>, ... ]
<valuePicker>        ::= <picker>
<picker>             ::= <objectPicker> | <arrayPicker> | <valuePicker>

# Pick operators
<objectPickOperator> ::= "#" | "#?"
<arrayPickOperator>  ::= "@" | "@?"
<pickOperator>       ::= <objectPickOperator> | <arrayPickOperator>

<pick>               ::= picker <pickOperator> expression
```

## Revision History

| Version  | Date | Content |
|:-------- |:---- |:------- |
| 0.1      | 2015-06-20 | Change rename to use `:`. Remove "this pickers". Change maybe pick to `?#`. |
| 0.2      | 2016-02-04 | Remove maybe picking. Move arrays to later section. |
| 0.3      | 2016-02-08 | Change computed property syntax from brackets to asterisk. |
| 0.4      | 2016-02-09 | Complete rewrite for organization and clarity. |
