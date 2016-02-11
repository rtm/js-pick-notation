# Extended dot notation in JavaScript

This repo provides information and a prototype of the proposal to extend JavaScript dot notation,
also called "pick notation".

See `js-pick-notation.md` for the proposal.

### Installation

    git clone https://github.com/rtm/js-pick-notation.git
    cd js-pick-notation
    npm install

### Testing

    npm test

### Running your own

 2. Create a JS file such as `test.sjs` (note extension).
 3. Compile it with `make test.js`.
 4. Run it with `babel-node test.js`.

### Basics

This proposal extends the dot notation,
by allowing the dot to be followed by `()` (yielding a value), `{}` (yielding an object), or `[] (yielding an array)`.
The `()` and `[]` forms follow destructuring syntax,
but with additional features.

### Examples

Assuming

    var o = { a: 1, p: 22, nested: { v: 'v' } };

#### Picking into a value

    o.(x!)        // retrieve a mandatory property (throws if missing))
    a.(-1)        // find last element of an array

#### Picking into an object

    o.{a}         // retrieve property 'a'
    o.{a, b}      // retrieve existing property and non-existing property
    o.{a, b!}     // retrieve mandatory property (throws)
    o.{a^}        // retrieve property which must not exist (throws if present))
    o.{a: foo}    // retrieve property and rename
    o.{b = 42}    // retrieve property with default
    o.{(keys)}    // retrieve properties given in array
    o.{/p/}       // retrieve properties matching regexp
    o.{a~, ...}   // omit `a`

#### Picking into an array

    o.[a]         // [o.a]
    o.[...]       // [o.a, o.b, ...]
    a.[1, 0]      // swap
    a.[-1 ... 0]  // reverse
    a.[0 ... n]   // slice

#### Guarded pick

    o.?a         // throws if `o` is not pickable

#### Creating a stored pick

    var pick = .{a, b};          // use unary dot to create stored pick
    var picked = pick(o);        // apply pick by calling it on object

### Implementation details

The pilot implementation uses the sweet.js macro package.
The macro definitions are in `lib/pick.js`.
The macros generate calls to runtime routines which are found in `lib/runtime.js`,
and are injected into the sweet output.
See `IMPLEMENTATION.md` for more details.

### Prerequisites

    npm install -g babel
