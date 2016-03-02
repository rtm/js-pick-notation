# POC pick notation implementation

The POC for pick notation is implemented using the sweet.js maro package.
See the [macro definitions](../lib//pick.js).
The macros generate calls to [runtime routines](../lib/runtime.js),
and are injected into the sweet output.

## Limitations and known bugs

### Binding of `.`

Because `.` is not implemented as a true operator with precedence,
but rather as a macro,
there may be cases where the LHS must be parenthesized.

### Parsing

Due to the use of sweet.js in the POC implementation,
some invalid constructs will result in obscure sweet error messages.
The entire program must be processable by sweet,
even portions which no code path will ever reach.
