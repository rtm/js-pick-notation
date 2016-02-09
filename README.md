# JavaScript "pick" (`#`) operator

This repo provides information and prototypes for the proposed JavaScript pick operator.

See `js-pick-operator.md` for the proposal.

### Installation

    git clone https://github.com/rtm/js-pick-operator.git
    cd js-pick-operator
    npm install

### Testing

    npm test

### Running your own

 2. Create a JS file such as `test.sjs` (note extension).
 3. Compile it with `make test.js`.
 4. Run it with `babel-node test.js`.

### Summary

Assuming

    var o = { a: 1, p: 22, nested: { v: 'v' } };

#### Picking into a value

    o #a           // retrieve value of property 'a' from o
    o #(a)         // retrieve value of property given by `a` from o
    o #nested # v  // retrieve a nested property
    o @x!          // retrieve a mandatory property (throws)

#### Picking into an object

    o #{a}           // retrieve property 'a'
    o #{a, b}        // retrieve existing property and non-existing property
    o #{a, b!}       // retrieve mandatory property (throws)
    o #{a^}          // retrieve property which must not exist (throws)
    o #{a: foo}      // retrieve property and rename
    o #{b = 42}      // retrieve property with default
    o #{(keys)}      // retrieve properties given in array
    o #{/p/}         // retrieve properties matching regexp
    o #{a~, ...}     // omit `a`

#### Picking into an array

    o #[a]           // [o.a]
    o #[...]         // [o.a, o.b, ...]

    a #[1, 0]        // swap
    a @[-1 to 0]     // reverse
    a @[0 to n]      // slice

#### Guarded pick

    o #? a            // throws if `o` is not pickable


#### Creating a stored pick

    var pick = #{a, b};          // use unary # to create stored pick
    var picked = pick(o);        // apply pick by calling it on object

### Implementation details

`lib/pick.js` contains the sweet.js macro definitions.
`lib/runtime.js` contains the JS runtime, which is injected into the sweet output.


### Prerequisites

    npm install -g babel
