// pick.sjs
//
// Sweet macros for JS pick operator.

// Turn a "bare key" (identifer) such as `a` into a literal `'a'`.
macro BareKey {
  case { _ $k:ident } => { return [makeValue(unwrapSyntax(#{$k}), #{$k})]; }
}

macro Range {
  rule { $r1:expr to $r2:expr } => { P.range($r1, $r2) }
}

// A plain old key is an indentifier, literal, or expression.
macro _Key {
  rule { $k:BareKey } => { P.key($k) }
  rule { $k:lit     } => { P.key($k) }
  rule { $k:expr    } => { P.key($k) }
}

macro All {
  rule { * } => { P.rest() }
}

// A "Key" is plain old key, a range, the all notation, or an object pick.
macro Key {
  rule { $x:Range }      => { $x }
  rule { $x:ObjectPick } => { $x }    // support o.{{a, b}!}
  rule { $x:_Key  }      => { $x }
  rule { $x:All   }      => { $x }
}

macro Picktype {
  rule { ! } => { must    }
  rule { ~ } => { omit    }
  rule { ^ } => { mustnot }
}

// Decorate a picker with operators for must, omit, etc.
// This rule supports only up to two decorators.
macro TypedKey {
  rule { $p:Key $t1:Picktype $t2:Picktype } => { $p, P.$t1(), P.$p2() }
  rule { $p:Key $t1:Picktype              } => { $p, P.$t1() }
  rule { $p:Key                           } => { $p }
}

// Add a renamer to a picker (using `as`).
macro RenamedPicker {
  rule { $p:TypedKey : $pick:ObjectPick } => { P.apply($p, P.object($pick)) }
  rule { $p:TypedKey : $pick:ArrayPick  } => { P.apply($p, P.array($pick)) }
  rule { $p:TypedKey as $n:_Key         } => { $p, P..rename($n) }
  rule { $p:TypedKey                    } => { $p }
}

macro Default {
  rule { := $d:expr } => { P.deflt($d) }
  rule { =  $d:expr } => { P.deflt($d, true) }
}


// Add a default to a picker (using equal sign).
macro Picker {
  rule { $p:RenamedPicker $d:Default } => { $p, $d }
  rule { $p1:RenamedPicker . $p2:ValuePick } => { P.deep($p1, $p2) }
  rule { $p:RenamedPicker            } => { $p }
}

macro PickList {
  rule { $p:Picker (,) ... }  => { P.list([$p (,) ...]) }
}

// Object, array, and value picklists
macro ObjectPick { rule { { $l:PickList } } => { P.object($l) } }
macro ArrayPick  { rule { [ $l:PickList ] } => { P.array($l)  } }
macro ParenPick  { rule { ( $l:PickList ) } => { $l } }
macro ValuePick  { rule {   $p:Picker     } => { P.value($l)  } }

let Pick = macro {
  rule { $p:ObjectPick } => { $p }
  rule { $p:ArrayPick  } => { $p }
  rule { $p:ParenPick  } => { $p }
  rule { $p:ValuePick  } => { $p }
}

// Here is the basic definition of the dot.
// TODO: add guarded forms for other cases.
let (.) = macro {
  rule infix { $o:expr |   $p:ident } => { $o.$p }
  rule infix { $o:expr |   $p:lit   } => { P.value(P.pick(P.key($p)))($o) }    // Support `a.'b'`
  rule infix { $o:expr |   $p:Pick  } => { $p($o) }
  rule infix { $o:expr | ? $p:Pick  } => { $p.guard()($o) }
  rule       {             $p:Pick  } => { $p     }
  rule       {           ? $p:Pick  } => { $p.guard() }
  rule       {                      } => { . }
}

export (.);

o.{*!};
