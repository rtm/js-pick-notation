// pick.sjs
//
// Sweet macros for JS pick operator.

// Primitive picker is string, identifier, or square-bracketed expression.
macro primitive {
  rule {   $p:lit    }
  rule { [ $p:expr ] } => { $p }
  case { _ $p:ident  } => { return [makeValue(unwrapSyntax(#{$p}), #{$p})]; }
}

// Primitive list is a single primitive picker, a parenthesized list of privitive pickers,
// or an ellipsis.
// These are things that can be decorated.
macro primitiveList {
  rule {   $p:primitive }           => { P.pick1($p) }
  rule { ( $p:primitive (,) ... ) } => { P.pick1([ $p (,) ... ]) }
  rule { $[...]                   } => { P.rest() }
}

macro decorator {
  rule { ! } => { mandatory }    // may be deprecated
  rule { + } => { mandatory }    // may become preferred
  rule { - } => { omit      }
  rule { ^ } => { notexist  }
}

// Decorate a picker with operators for mandatory, omit, etc.
// This rule supports only up to two decorators.
macro decoratedPicker {
  rule { $p:primitiveList $d1:decorator $d2:decorator } => { P.$d1(P.$d2($p)) }
  rule { $p:primitiveList $d1:decorator               } => { P.$d1($p)        }
  rule { $p:primitiveList                             } => { $p }
}

// Add a renamer to a picker (using colon).
macro renamedPicker {
  rule { $p: decoratedPicker : $d:primitive } => { P.rename($p, $d) }
  rule { $p: decoratedPicker                } => { $p }
}

// Add a default to a picker (using equal sign).
macro defaultPicker {
  rule { $p: renamedPicker = $d:expr } => { P.deflt($p, $d) }
  rule { $p: renamedPicker           } => { $p }
}

// Complex picker includes subpickers (a # b).
// The left hand must be parenthesized to include renamers or defaults.
macro complexPicker {
  rule {   $p1: decoratedPicker # $p2:defaultPicker } => { P.pick1($p2, $p1) }
  rule { ( $p1: defaultPicker ) # $p2:defaultPicker } => { P.pick1($p2, $p1) }
  rule {   $p:  defaultPicker                       } => { $p }
}

// Pick assignment operator.
macro (#=) {
  case infix { $p:ident | _ $o:expr } => {
    return #{ $p = $p # $o }
  }
}

// The main macro for the pick operator.
// Cases include picking into objects, and picking into values.
macro (#) {
  // Pick into object
  case infix { { $p:complexPicker (,) ... } | _ $o:expr } => {
    return #{ P.pickObj($o, [$p (,) ...]) }
  }

  // Pick into value.
  // We do not appear to be able to use our pre-defined constructs here,
  // due to sweet's restriction on top-level look-behinds.

  // 'a`! # b
  case infix {   $p:lit    ! | _ $o:expr } => { return #{ P.pickVal($o, P.mandatory(P.pick1($p))) } }

  // 'a` # b
  case infix {   $p:lit      | _ $o:expr } => { return #{ P.pickVal($o, P.pick1($p))              } }

  // [a]! # b
  case infix { [ $p:expr ] ! | _ $o:expr } => { return #{ P.pickVal($o, P.mandatory(P.pick1($p))) } }

  // [a] # b
  case infix { [ $p:expr ]   | _ $o:expr } => { return #{ P.pickVal($o, P.pick1($p))              } }

  // a! # b
  case infix {   $p:ident  ! | _ $o:expr } => {
    letstx $p = [makeValue(unwrapSyntax(#{$p}), #{$p})];
    return #{ P.pickVal($o, P.mandatory(P.pick1($p))) }
  }

  // a # b
  case infix {   $p:ident    | _ $o:expr } => {
    letstx $p = [makeValue(unwrapSyntax(#{$p}), #{$p})];
    return #{ P.pickVal($o, P.pick1($p)) }
  }

  // (a = 42) # b
  case infix { ( $p:complexPicker ) | _ $o:expr } => {
    return #{ P.pickVal($o, $p) }
  }
}

export (#);
