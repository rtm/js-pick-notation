===WORK IN PROGRESS===

# JS pick operator design notes

This document outlines smoe of the design issues that arose during the design of the proposed JS pick operator,
and motivations for their solution.

The most basic motivation for the pick operator was to be able to pick (deconstruct) objects into other objects,
not just into variables as the current deconstructing syntax permits.
In other words, we want to create an object with properties `p1` and `p2` taken from a source object.

This is not a new problem.
It has been the subject of some other proposed syntaxes in the past.
For instance:

    o.{p1, p2}

This seems promising at first glance.
We can extend this is ways reminiscent of deconstructing to provide defaults and renaming:

    o.{p1: q1 = 1, p2: q2 = 2}

We can borrow computed property name syntax to say

    o.{[n1]}

which would mean to create an object with a property whose name is given by the expression `n1`,
taken from `o`.

array minus indices

    a #-1
    a.-1
    a.(-1)
    a.b!
    a.[b!]
