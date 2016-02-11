# POC pick notation implementation

The POC for pick notation is implemented using the sweet.js maro package.
The macro definitions are in `lib/pick.js`.
(An alternative set of macro definitions, using `#` rather than `.`,
are in `lib/pick-hash.sjs`).
The macros generate calls to runtime routines which are found in `lib/runtime.js`,
and are injected into the sweet output.

## Limitations and known bugs

### Range (...)

If the first element of a range is a numeric literal,
it must be followed by a space in order to avoid the first dot of the ellipsis being parses as a decimal point.

### Picktypes

Only up to two picktypes (`!`, `~`, and `^`) are supported.
Of course, combining three would not have much meaning.
Duplicate picktypes are not caught.

### Binding of `.`

Because `.` is not implemented as a true operator with precedence,
but rather as a macro,
there may be cases where the LHS must be parenthesized.

### Parsing

Due to the use of sweet.js in the POC implementation,
some invalid constructs will result in obscure sweet error messages.
The entire program must be processable by sweet,
even portions which no code path will ever reach.
