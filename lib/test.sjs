// pick.sjs
//
// Sweet macros for JS pick operator.

// Key is string, identifier, or starred expression.
macro Key {
  case { _ $k:ident   } => { return [makeValue(unwrapSyntax(#{$k}), #{$k})]; }
  case {   $k:lit     } => { $k }
  rule {   $k:expr    } => { $k }
}

macro Range {
  rule { $r1:expr to $r2:expr } => { P.pickRange($r1, $r2) }
}

// Keyset is a key, a parenthesized list of keys, or an ellipsis.
// These are things that can be decorated.
macro Keyset {
  rule { $r:Range } => { $r }
  rule { $k:Key   } => { P.keyset($k) }
  rule { $[...]   } => { P.rest() }
  rule { < $k:Key (,) ... > } => { P.keyset([$k (,) ...]) }
}

macro Picktype {
  rule { ! } => { must    }      // may be deprecated
  rule { ~ } => { omit    }
  rule { ^ } => { mustnot }
}

// Decorate a picker with operators for must, omit, etc.
// This rule supports only up to two decorators.
macro TypedKeyset {
  rule { $p:Keyset $t1:Picktype $t2:Picktype } => { P.$t1(P.$t2($p)) }
  rule { $p:Keyset $t1:Picktype              } => { P.$t1($p)        }
  rule { $p:Keyset                           } => { $p }
}

// Add a renamer to a picker (using colon).
macro renamedPicker {
  rule { $p:TypedKeyset : $n:Key } => { P.rename($p, $n) }
  rule { $p:TypedKeyset          } => { $p }
}

// Add a default to a picker (using equal sign).
// In other places, this is called a "simple" picker.\
// That is probably a better name.
macro defaultPicker {
  rule { $p: renamedPicker := $d:expr } => { P.deflt($p, $d, true) }
  rule { $p: renamedPicker = $d:expr  } => { P.deflt($p, $d)       }
  rule { $p: renamedPicker            } => { $p }
}

// Complex picker includes subpickers (a # b).
// The left hand must be parenthesized to include renamers or defaults.
macro complexPicker {
  rule {   $p1: TypedKeyset # $p2:defaultPicker     } => { P.keyset($p2, $p1) }
  rule { ( $p1: defaultPicker ) # $p2:defaultPicker } => { P.keyset($p2, $p1) }
  rule {   $p:  defaultPicker                       } => { $p }
}

// Pick assignment operator.
macro (#=) {
  case infix { $p:ident | _ $o:expr } => {
    return #{ $p = $p # $o }
  }
}

// Pickee (object being picked from).
// May be prefixed with `?` to guard for object validity.
macro pickee {
  rule { ? $o:expr } => { P.guard($o) }
  rule {   $o:expr }
}

// Object picklist
macro fuck {
  // rule { { $p.complexPicker (,) ... } } => #{ fuck }
  rule { a } => #{ fuck }
}
