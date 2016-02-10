## Limitations and known bugs

### Range (...)

If the first element of a range is a numeric literal,
it must be followed by a space in order to avoid the first dot of the ellipsis being parses as a decimal point.

### Picktypes

Only up to two picktypes (`!`, `~`, and `^`) are supported.
Of course, combining three would not have much meaning.
Duplicate picktypes are not caught.

### Binding of `#`

Because `#` is not implemented as a true operator with precedence,
but rather as a macro,
there may be cases where the LHS must be parenthesized.
