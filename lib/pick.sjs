// pick.sjs
//
// Sweet macros for JS pick operator.

// Private macro defining simple pickers.
macro _prop {
  rule {   $p:lit    }
  rule { [ $p:expr ] } => { $p }
  case { _ $p:ident  } => { return [makeValue(unwrapSyntax(#{$p}), #{$p})]; }
}

// Another private macro for simple pickers adorned with
// default, renaming, and mandatory decorators.
macro _prop1 {
  rule { $p:_prop   : $n:_prop = $d:expr } => { { p: $p,          n: $n, d: $d } }
  rule { $p:_prop   = $d:expr            } => { { p: $p,                 d: $d } }
  rule { $p:_prop   : $n:_prop           } => { { p: $p,          n: $n        } }
  rule { $p:_prop ! : $n:_prop = $d:expr } => { { p: $p, f: true, n: $n, d: $d } }
  rule { $p:_prop ! = $d:expr            } => { { p: $p, f: true,        d: $d } }
  rule { $p:_prop ! : $n:_prop           } => { { p: $p, f: true, n: $n        } }
  rule { $p:_prop !-                     } => { { p: $p, m: true, f: true      } }
  rule { $p:_prop !                      } => { { p: $p, f: true,              } }
  rule { $p:_prop ^                      } => { { p: $p, x: true               } }
  rule { $p:_prop -!                     } => { { p: $p, m: true, f: true      } }
  rule { $p:_prop -                      } => { { p: $p, m: true               } }
  rule { $[...]   ^                      } => { { r: true, x: true             } }
  rule { $[...]   !                      } => { { r: true, f: true             } }
  rule { $[...]     = [ $n:expr ]        } => { { r: true,        n: $n        } }
  rule { $[...]                          } => { { r: true                      } }
  rule { $p:_prop                        } => { { p: $p                        } }
}

// Pick assignment operator.
macro (#=) {
  case infix { $p:ident | _ $o:expr} => {
    return #{ $p = $p # $o }
  }
}

// The main macro for the pick operator.
// Cases include picking into objects, and picking into values.
macro (#) {
  case infix { { $p:_prop1 (,) ... } | _ $o:expr } => {
    return #{
      pick($o, [
        $p (,) ...
      ])
    }
  }
  case infix {   $p:lit    ! | _ $o:expr } => { return #{ pickOne($o, { p: $p, f: true }) } }
  case infix {   $p:lit      | _ $o:expr } => { return #{ pickOne($o, { p: $p          }) } }
  case infix { [ $p:expr ] ! | _ $o:expr } => { return #{ pickOne($o, { p: $p, f: true }) } }
  case infix { [ $p:expr ]   | _ $o:expr } => { return #{ pickOne($o, { p: $p          }) } }
  case infix {   $p:ident  ! | _ $o:expr } => {
    letstx $p = [makeValue(unwrapSyntax(#{$p}), #{$p})];
    return #{ pickOne($o, { p: $p, f: true }) }
  }
  case infix {   $p:ident    | _ $o:expr } => {
    letstx $p = [makeValue(unwrapSyntax(#{$p}), #{$p})];
    return #{ pickOne($o, { p: $p }) }
  }
}

export (#);
