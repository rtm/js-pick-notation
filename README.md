## Proposal: Picked Properties in JavaScript

This is a proposal to extend JavaScript object literal syntax to include properties "picked" (destructured) from other objects.

We use the syntax for destructuring assignment,
placed **inside** the `{}` surrounding the object literal being defined.

    { {p1, p2} = obj1 }

The above evaluates to an object with properties `p1` and `p2` having the corresponding values from `obj1`.

This syntax can be combined with the other existing possibilities for specifying properties in object literals:

    { {p1, p2} = obj1, p3: 1, p4, ...obj2 }

Because we are using destructuring assignment syntax, we can use defaults, renaming, and nesting:

    const obj = {p1: 1, p2: {p21: 21}};

    { {p1: new_p1, p2: {p21}, p3 = 3 } = obj }         // { new_p1: 1, p21: 21, p3: 3 }

### Background and Motivation

The motivation is for this proposal is expressiveness and brevity for the common use case of picking properties from objects.

There is ample precedent in the history of JavaScript for the gradual expansion of object literal syntax,
notably shorthand property syntax `{ a }` in ES6,
and then property spread syntax `{ ...obj }` currently in the proposal stage.
Both extensions make JS more expressive and concise. This proposal is in that spirit.

Currently we have destructuring assignment,
which provides a useful way to extract properties from objects.
However, it is limited to assigning the values to variables.
This proposal can be thought of as a natural extension to destructuring assignment,
leveraging its syntax, to allow destructuring into properties of objects.

Picking properties from an object is a common use case in today's JavaScript,
but currently requires approaches such as

    const newObject = {prop1: object.prop1, prop2: object.prop2};

or

    const {prop1, prop2} = object;
    const newObject = {prop1, prop2};

The use case for this feature can also be considered to be validated by the existence of the `_.pick` utilities available in several popular libraries.
People in the real world also regularly wonder about the absence of native facilities for picking/destructuring from objects into objects,
instead of just variables.

It makes good sense to re-use the current `{a, b} = obj` destructuring assignment syntax,
since what we are trying to do is in fact a kind of destructuring assignment,
the difference being that the "assignment" is to an object property rather than a variable.

### Specification

This is a highly preliminary and very partial description of changes to the specification to accommodate this feature.

Add another alternative for *PropertyDefinition* to the syntax for object literals ("Object Initializer")
found in [Section 12.2.6](http://www.ecma-international.org/ecma-262/6.0/#sec-object-initializer) of the spec, as follows:

    *PropertyDefinition*:
      *ObjectAssignmentPattern* = *AssignmentExpression*

recalling that *ObjectAssignmentPattern* is the LHS of a destructuring assignment
(including nested properties, defaults, and renamings),
and *AssignmentExpression* is the object to be picked from ("destructured").

### History

Various proposals have been made in the past for picking from objects into other objects.
[One is here](https://esdiscuss.org/topic/extended-dot-notation-pick-notation-proposal),
although it involves a different syntax.
