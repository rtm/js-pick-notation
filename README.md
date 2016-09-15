# JavaScript pick notation, or extended dot notation

This repo provides proposals to enhance JavaScript with mechanisms for creating new objects with properties "picked" from other objects.

See the following documents:

1. A [full-featured proposal](js-pick-notation.md) and a [friendly introduction](docs/intro.md)
2. A lightweight proposal called [minimally extended dot notation](minimally-extended-dot-notation.md)
3. An alternative proposal for [deconstructing assignment into objects](deconstructing-assignment-into-object.md).

### Extended dot notation

This proposal extends JavaScript's current dot notation,
to make it much easier to manipulate object properties,
by "picking" them into new objects.
It allows the dot to be followed by `()` (yielding a value), `{}` (yielding an object), or `[]` (yielding an array).
The `()` and `[]` forms loosely follow destructuring syntax,
but with many additional features.

```
o.{p1, p2}
```

### Minimally extended dot notation

Minimally extended dot notation adheres to current destructuring syntax,
and allows only the form `object.{props, ...}`.

### Deconstructing assignment into objects

This alternative proposal precisely mimics current deconstructing assignment,
but permits deconstructing into objects by wrapping it in curly braces:

```
{ {p1, p2} = o }
```
