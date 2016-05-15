# Minimally extended dot notation

The extended dot notation contains a wide variety of features,
such as nested picking, deep picking, null/existential propagation, picks as functions (`a.map(.prop)`, ranges, and "pick types" for must/not keys.
These features, however useful, complicate the definition and implementation of extended dot notation.

The **minimally extended dot notation** presented in this document gets rid of all these features.
It is meant to be an alternative proposal that could greatly reduce the footprint of the spec,
not to mention implementation effort,
by leveraging deconstructing assignment ideas in their entirety.

Minimally extended dot notation simply states that deconstructions (in terms of the spec, *AssignmentPattern*),
which currently may occur only on the left-hand side of equal signs (or in parameter lists),
**may now occur after dots**.
The syntax of the *Assignment Pattern* is identical.
The semantics are that the variables that would be assigned if the *AssignmentPattern* were on the left of an assignment statement
are treated as properties to be added to a newly created object,
and their values are found not in the object to the right of the equal sign, but rather in the object to the left of the dot.

It's simpler that it sounds.
Whereas in the destructuring assignment

    let {a} = o;

the property `a` is found in `o`, and its value assigned to variable `a`,
in the minimally extended dot notation, in the expression

    {a: 1}.{a}                         // {a: 1}

the property `a` is found in `o`, and a new object constructed with a property `a` with its value.

All the other features of *AssignmentPattern* work as expected.

Renaming:

    {a: 1}.{a: b}                 // {b: 1}

Defaults:

    {a: 1}.{b = 42}              // {b: 42}

Deep picking:

    {a1: {a2: 42}}.{a1: {a2}}    // {a2: 42}
