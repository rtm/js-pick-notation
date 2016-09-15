# Deconstructing assignment into objects

The fundamental objective of the proposals in this repo is to facilitate "picking"--
taking certain properties from one object into another.
This spec is for an alternative to the [main proposal](js-pick-notation.md) and the
proposal for [minimally extended dot notation](minimally-extended-dot-notation).

This proposal re-uses current deconstructing assignment syntax exactly,
but **wraps it in curly brackets**.

For each variable name to which normally some deconstructed value would have been assigned,
instead a property is placed in a newly constructed object with that name and that value.
The equivalent of the syntax `o.{p1, p2}` as proposed elsewhere in this repo would be

    { {p1, p2} = o }

One advantage of this notation is that it allows picking from multiple objects, as in

    { {p1} = o1, {p2} = o2 }    // yields { p1: o1.p1, p2: o2.p2 }

As with other versions of the proposal,
defaults and renaming within the destructuring construct is fully supported.

This syntax is believed to be unambiguously parsable,
and entirely backward compatible since this syntax could not exist in any valid JS program.
