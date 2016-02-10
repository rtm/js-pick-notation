// pick.sjs
//
// Sweet macros for JS pick operator.

// Key is identifier, range, string, or rest.

macro BareKey {
  case { _ $k:ident } => { return [makeValue(unwrapSyntax(#{$k}), #{$k})]; }
}

macro Range {
  rule { $r1:expr $[...] $r2:expr } => { $r1, $r2 }
}

macro _Key {
  rule { $k:BareKey } => { $k }
  rule { $k:lit     } => { $k }
  rule { $k:expr    } => { $k }
}

macro Key {
  rule { $r:Range } => { P.range($r) }
  rule { $k:_Key  } => { P.key  ($k) }
  rule { $[...]   } => { P.rest()    }
}

macro Picktype {
  rule { ! } => { must    }      // may be deprecated
  rule { ~ } => { omit    }
  rule { ^ } => { mustnot }
}

// Decorate a picker with operators for must, omit, etc.
// This rule supports only up to two decorators.
macro TypedKey {
  rule { $p:Key $t1:Picktype $t2:Picktype } => { P.$t1(P.$t2($p)) }
  rule { $p:Key $t1:Picktype              } => { P.$t1($p)        }
  rule { $p:Key                           } => { $p }
}

// Add a renamer to a picker (using colon).
macro RenamedPicker {
  rule { $p:TypedKey : $n:_Key } => { P.rename($p, $n) }
  rule { $p:TypedKey           } => { $p }
}

// Add a default to a picker (using equal sign).
macro Picker {
  rule { $p: RenamedPicker := $d:expr } => { P.deflt($p, $d, true) }
  rule { $p: RenamedPicker  = $d:expr } => { P.deflt($p, $d)       }
  rule { $p: RenamedPicker            } => { $p }
}

// Object, array, and value picklists
macro ObjectPick { rule { { $p:Picker (,) ... } } => { P.objectPick([$p (,) ...]) } }
macro ArrayPick  { rule { [ $p:Picker (,) ... ] } => { P.arrayPick ([$p (,) ...]) } }
macro ValuePick  { rule {   $p:Picker           } => { P.valuePick ($p) }           }

macro Pick {
  rule { $p:ObjectPick } => { $p }
  rule { $p:ArrayPick  } => { $p }
  rule { $p:ValuePick  } => { $p }
}

// Here is the basic definition of the # operator,
// implemented here as a macro.
macro (#) {
  rule infix { $o:expr | ? $p:Pick } => { $p(P.guard($o)) }
  rule infix { $o:expr |   $p:Pick } => { $p($o)          }
  rule       {             $p:Pick } => { $p              }
}
