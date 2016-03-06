// pick.sjs
//
// Sweet macros for JS pick operator.

// A plain old key is an indentifier, literal, or expression.
// This is also the construct taken by a renamer.
macro _Key {
  case { _ $k:ident } => { return [makeValue(unwrapSyntax(#{$k}), #{$k})]; }
  rule { $k:lit }     => { $k }
  rule { $k:expr }    => { $k }
}

// A "Key" is plain old key, a range, the all notation, or a grouping.
macro Key {
  rule { $r1:expr to $r2:expr } => { P.range($r1, $r2) }
  rule { { $l:PickList } }      => { $l }
  rule { $x:_Key }              => { P.key($x) }
  rule { * }                    => { P.rest () }
}

macro Modifier {
  rule { ! }            => { P.must() }
  rule { ~ }            => { P.omit() }
  rule { ^ }            => { P.mustnot() }
  rule { .. $pick:Key } => { P.nest($pick) }
  rule { . $pick:Key }  => { P.deep($pick) }
  rule { : $n:_Key }    => { P.rename($n) }
  rule { := $d:expr }   => { P.deflt($d, {force: true}) }
  rule { (:=) $d:expr } => { P.deflt($d, {force: true, call: true}) }
  rule { (=) $d:expr }  => { P.deflt($d, {call: true}) }
  rule { =  $d:expr }   => { P.deflt($d) }
}

macro Picker {
  rule { $key:Key $m:Modifier ...  } => { P.modify($key, [$m (,) ...]) }
}

macro PickList {
  rule { $p:Picker (,) ... }  => { P.list($p (,) ...) }
}

// Object, array, and value picklists
macro ObjectPick { rule { { $l:PickList } } => { P.object($l) } }
macro ArrayPick  { rule { [ $l:PickList ] } => { P.array($l)  } }
macro ParenPick  { rule { ( $l:PickList ) } => { P.value($l)  } }
macro ValuePick  { rule {   $p:Picker     } => { P.value($p)  } }

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
  rule infix { $o:expr |   $p:Pick  } => { $p($o) }
  rule infix { $o:expr | ? $p:Pick  } => { $p.guard()($o) }
  rule       {             $p:Pick  } => { $p     }
  rule       {           ? $p:Pick  } => { $p.guard() }
  rule       {                      } => { . }
}

export (.);
