// pick.sjs
//
// Sweet macros for JS pick operator.

// Turn a "bare key" (identifer) such as `a` into a literal `'a'`.
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
  rule { $[...]   } => { P.rest (  ) }
  rule { $p: GroupPick } => { $p }
}

macro Picktype {
  rule { ! } => { must    }
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
//  rule { $p:TypedKey : $pick:ObjectPick } => { P.apply($p, $pick) }
//  rule { $p:TypedKey : $pick:ArrayPick  } => { P.apply($p, $pick) }
  rule { $p:TypedKey -> $n:_Key          } => { P.rename($p, $n) }
  rule { $p:TypedKey                    } => { $p }
}

// Add a default to a picker (using equal sign).
macro Picker {
  rule { $p:RenamedPicker := $d:expr } => { P.deflt($p, $d, true) }
  rule { $p:RenamedPicker  = $d:expr } => { P.deflt($p, $d)       }
  rule { $p1:RenamedPicker . $p2:ValuePick } => { P.deep($p1, $p2) }
  rule { $p:RenamedPicker            } => { $p }
}

// Object, array, and value picklists
macro ObjectPick { rule { {  $p:Picker (,) ... }  } => { P.pick([$p (,) ...]) } }
macro ArrayPick  { rule { [  $p:Picker (,) ... ]  } => { P.pick([$p (,) ...]) } }
macro GroupPick  { rule { <| $p:Picker (,) ... |> } => { P.pick([$p (,) ...]) } }
macro ParenPick  { rule { (  $p:Picker (,) ... )  } => { P.pick([$p (,) ...]) } }
macro ValuePick  { rule {    $p:Picker            } => { P.pick([$p        ]) } }

macro Pick {
  rule { $p:ObjectPick } => { P.object($p) }
  rule { $p:ArrayPick  } => { P.array ($p) }
  rule { $p:GroupPick  } => { P.group ($p) }
  rule { $p:ParenPick  } => { P.value ($p) }
  rule { $p:ValuePick  } => { P.value ($p) }
}

// Here is the basic definition of the dot,
// implemented here as a macro.
// TODO: add guarded forms for other cases.
let (.) = macro {
  rule infix { $o:expr |   $p:ident } => { $o.$p }
  rule infix { $o:expr |   $p:lit   } => { P.value(P.pick(P.key($p)))($o) }    // Support `a.'b'`
  rule infix { $o:expr |   $p:Pick  } => { $p($o) }
  rule infix { $o:expr | ? $p:Pick  } => { $p(P.guard($o)) }
  rule       {             $p:Pick  } => { $p     }
  rule       {                      } => { . }
}

export (.);

. ...
