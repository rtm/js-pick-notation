===WORK IN PROGRESS===

Section 12.3.2, Property Accessors, is modified as follows, after the paragraph starting "or the bracket notation":

> or the pick notation:
*MemberExpression* . *PickPattern*
*CallExpression* . *PickPattern*

Section 14.6.2.2, Expression Rules, is modified as follows, adding another construction to *MembeExpression* and *CallExpression*:

> *MemberExpression* . *PickPattern*
> *CallExpression* . *PickPattern*

A new section 12.14.6, Picking, is added after 12.4.5, Destructuring Assignment, and parallel to it:

PickPattern:
  ObjectPickPattern
  ArrayPickPattern
  ValuePickPattern

ObjectPickPattern:
  { }
  { PickPropertyList }
  { PickPropertyList,  }

ArrayPickPattern:
  [ ]
  [ PickPropertyList ]
  ( PickPropertyList, ]

ValuePickPattern:
  ( PickProperty )

PickPropertyList:
  PickProperty
  PickPropertyList, PickProperty

PickProperty:
  IdentifierReference Initializer
  PropertyName : PickElement

PickElement:

PickType:
  ^
  !
  ~

PickTypeList:
  PickType
  PickTypeList PickType
