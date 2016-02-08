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

    a          # o   // retrieve value of property 'a' from o
    [p]        # o   // retrieve value of property given by `p` from o
    b          # o   // retrieve a non-existent property from `o`
    v # nested # o   // retrieve a nested property
    x!         # o   // retrieve a mandatory property (throws)

#### Picking into an object

    {a}        # o   // retrieve property 'a'
    {a, b}     # o   // retrieve existing property and non-existing property
    {a, b!}    # o   // retrieve mandatory property (throws)
    {a^}       # o   // retrieve property which must not exist (throws)
    {a: foo}   # o   // retrieve property and rename
    {b = 42}   # o   // retrieve property with default
    {[['a']]}  # o   // retrieve properties given in array
    {[/p/]}    # o   // retrieve properties matching regexp

#### Assignment pick

    a          #= o  // assigns o.a to variable a

#### Checked pick

    a          #? o  // throws if `o` is not pickable

### Implementation details

`lib/pick.js` contains the sweet.js macro definitions.
`lib/runtime.js` contains the JS runtime, which is injected into the sweet output.


### Prerequisites

    npm install -g babel faucet
