## Proposal: Picked Properties in JavaScript (aka Extended Object Destructuring)

This is a proposal to extend object destructuring to allow the destructuring of object properties ("picking") into new and existing objects.

### Subsetting ("picking from") objects

To subset ("pick from") an object,
we write the object name (or an expression evaluating to an object), then a dot,
then a destructuring construct
(to be precise, the *ObjectAssignmentPattern* coming to the left of the equal sign in a destructuring assignment).

    obj.{p1, p2}

Note the parallel: `obj.p1` already means to extract the value of `p1` from `obj` (as a scalar).
Now, the syntax `obj.{p1, p2}` means to extract the values of `p1` and `p2` from `obj` (as an object).
In other words, this can be considered a straightforward extension of both current dot notation and destructuring syntax.

Because we are using the same *ObjectAssignmentPattern* used in destructuring assignment,
we can use defaults, renaming, and nesting without further ado:

    obj.{p1: new_p1, p2: {p21}, p3 = 3}

### Setting selected properties ("picking into") objects

To bring in a subset of properties *into* an object,
we again write the object name, then a dot,
then a destructuring construct (again, *ObjectAssignmentPattern*),
followed by an equal sign and the object to be "picked" from.

    obj1.{p1, p2} = obj2

Again, this is completely parallel: `obj.p1 = value` already means to set the value of `p1` in `obj` to `value`.
Now, the syntax `obj.{p1, p2} = obj2` means to extract the values of `p1` and `p2` from `obj2`
and add them to `obj1`.
Again, we have a straightforward extension of both current property assignment notation and destructuring syntax.

Subject to further thinking,
if the object being picked into is null or undefined it would be created.
If it were not an object it would be a `TypeError`.

### Background and motivation

The motivation is for this proposal is

1. Expressiveness and brevity for the common use cases of picking properties from objects into existing or new objects.
1. Achieving parity by extending destructuring into object properties, not just variables.
1. Achieving parity by estending the dot notation to refer to sets of properties on an object, not just a single property.
1. (Possibly) enabling certain engine optimizations in the case of setting multiple properties on an object,
such as in `obj1.{p1, p2} = obj2`, in which the retrieval from `obj2`, and the setting into `obj1`, could possibly be optimized, in comparsion to `obj1.p1 = obj2.p1; obj1.p2 = obj2.p2;`.

Currently we have destructuring assignment,
which provides a useful way to extract properties from objects.
However, it is limited to assigning the values to variables.
This proposal can be thought of as a natural extension to destructuring assignment,
leveraging its syntax, to allow destructuring into properties of objects.
It brings parity to the concept of destructuring.

Picking properties from an object is a common use case in today's JavaScript,
but currently requires approaches such as

    const newObject = {prop1: object.prop1, prop2: object.prop2};

or

    const {prop1, prop2} = object;
    const newObject = {prop1, prop2};

The use case for this feature can also be considered to be validated by the existence of the `_.pick` utilities available in several popular libraries.
People in the real world also regularly wonder about the absence of native facilities for picking/destructuring from objects into objects,
instead of just variables.

It makes good sense to re-use the current dot notation, which programmers have used and loved for two decades.
since what we are trying to do is in fact setting and retrieving object properties,
the difference being that we are setting or retrieving more than one at a time.

In that sense, this proposal can be viewed as bringing parity to both object destructuring,
and dot notation,
by allowing the existing destrucuturing concept to be applied uniformly in conjunction with dot notation.

### Implementation issues

Subject to review by experts, we think this proposal has a small syntactic footprint.
Implementation should be facilitated to the extent existing deconstructing logic can be leveraged.

### Specification

This is a highly preliminary and very partial description of changes to the specification to accommodate this feature.

Add alternatives for *PropertyDefinition* to the syntax for object literals ("Object Initializer")
found in [Section 12.3.2](http://www.ecma-international.org/ecma-262/6.0/#sec-property-accessors) of the spec, as follows:

    *MemberExpression* . *ObjectAssignmentPattern*
    *CallExpression* . *ObjectAssignmentPattern*

recalling that *ObjectAssignmentPattern* is the LHS of a destructuring assignment
(including nested properties, defaults, and renamings),
Make additional changes to Section 12.3.2.1 concerning run-time semantics.

Then in [Section 12.14.5](http://www.ecma-international.org/ecma-262/6.0/#sec-destructuring-assignment),
make the appropriate syntactical changes.

### History

Various proposals have been made in the past for picking from objects into other objects.
[One is here](https://esdiscuss.org/topic/extended-dot-notation-pick-notation-proposal),
although it involves a different syntax.

The earliest version of this proposal placed the object to be picked from first,
then a sharp (hash) symbol,
then the *ObjectAssignmentPattern* indicating what properties to be picked:

    object # {prop1, prop2}

To avoid consuming another precious symbol,
this was then revised to use a period (dot) instead of the hash sign.
For this reason, we called this "extended dot notation".

    object.{prop1, prop2}

The next version brought the entire assignment syntax into object literals,
making it easier to pick from multiple objects:

    { {p1, p2} = p, {q1, q2} = q }

The current proposal reverts to dot notation (`obj.{prop1, prop1}`),
for symmetry with the new feature of being able to assign properties into objects,
as in `obj1.(prop1, prop2} = obj2`.
