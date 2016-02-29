// Runtime for sweet-based pick operator implementation.
// Define functions `pick` for picking into an object,
// and `pickOne` for picking single values.


// SMALL UTILITIES

// Make a function from a constant, if necessary.
function g(f) { return typeof f === 'function' ? f : () => f; }

// Make a range from one number to another, going up or down.
function _range(a, b) {
  let result = [];

  if (a <= b) while (a <= b) result.push(a++);
  else while (a >= b) result.push(a--);

  return result;
}

// Convert back and froth between p/v pairs, and one-property objects.
function make_obj(pair) { return {[pair.p]: pair.v}; }

function make_pair(p, i, o) {
  if (Array.isArray(o) && p < 0) p += o.length;
  return {p, i, v: o[p]};
};

// Filter out omitted properties.
const not_omitted = pair => !pair.omit;


// BASIC COMBINATORS

// Combine the key/value pairs returned from a series of picks.
// Each pick is passed the results so far.
// Result is the combined list of k/v pairs.
function list(...l) {
  console.log("args to list are", l);
  return function(o, pairs) {
    console.log("args to inside func are", o, pairs);
    return l.reduce((result, f) => result.concat(f(o, result)), pairs);
  };
}

// Find the result of a series of transforms.
// Each element is passed the pairs resulting from the previous one.
function modify(...funcs) {
  return function(o, pairs) {
    return funcs.reduce((result, f) => f(o, result), pairs);
  };
}


// IMPLEMENT MODIFIERS

// Insist that each pair does have a value.
function must() {
  return function(o, pairs) {
    function one(pair) {
      let {p, v} = pair;
      if (v === undefined)
        throw new ReferenceError(`Must property '${p}' is missing from object '${o}'`);
      return pair;
    }
    if (!pairs.length) throw new ReferenceError(`Must properties are missing from object '${o}'`);

    return pairs.map(one);
  };
}

// Rename the property in each pair.
function rename(n) {
  return function(o, pairs) {
    function one(pair, i) {
      pair.p = pair.n = g(n)(pair.p, i, o);
      return pair;
    }

    return pairs.map(one);
  };
}

// Remove pairs from output.
// We marke them omitted, rather than removing them, so that the `*` notation does the right thing.
function omit() {
  return function(o, pairs) {
    function one(pair) {
      pair.omit = true;
      return pair;
    }

    return pairs.map(one);
  };
}

// Assign a default to pairs with undefined values.
function deflt(d, isFunc) {
  return function(o, pairs) {
    function one(pair, i) {
      if (pair.v === undefined)
        pair.v = isFunc ? d(pair.p, i, o) : d;
    }

    pairs.forEach(one);
    return pairs;
  };
}

// Implement "mustnot" flag, forbidding presence of property.
// Or, for computed properties, require they evaluate to none.
function mustnot() {

  return function(o, pairs) {
    function one(pair) {
      if (pair.v !== undefined)
        throw new ReferenceError(`Must-not-exist property ${pair.p} is present`);
    }
    if (pairs.length) throw new ReferenceError(`Must-not-exist properties are present`);

    pairs.forEach(one);
    return pairs;
  };
}

// Grab the "rest" of the properties--
// the ones not already mentioned in previous pickers.
function rest() {
  return function(o, pairs) {
    var existing = pairs.map(pair => pair.p);
    var keys = Object.keys(o) .
          filter(p => !existing.includes(p) && !existing.includes(Number(p)));
    return keys . map((p, i) => make_pair(p, i, o));
  };
}

// Given a deep picker (from syntax `a.b`), retrieve sub-properties.
function deep(func) {
  return function(o, pairs) {
    var deeps = pairs.map(basePair => func(basePair.v, []));
    return [].concat(...deeps);
  };
}

// Apply a picker to a picked value; used by nested pickers (`{a: {b}}`).
// The key to extract is keyfunc, and pickfunc picks from the result.
function nest(x) {
  return function(o, pairs) {
    // This is the key(s) to be picked from, as array of k/v pairs.
    let keyPairs = keyfunc(o, {propNames: []});
    let result = keyPairs . map(({p, i, v}) => ({p, i, v: pickfunc(v, {propNames: []})}));
    return result;
  };
}

// Given a keyspec, break it down into the keys it refers to.
function key(p) {

  return function(o, pairs) {

    // Expand a property descriptor into a list of actual property names.
    function explode() {
      switch (Object.prototype.toString.call(p)) {
        case '[object Array]'    : return p;
        case '[object Object]'   : return keys;
        case '[object RegExp]'   : return keys . filter(k => p.test(k));
        case '[object Number]'   :
        case '[object String]'   : return [p];
        case '[object Undefined]': return [];
        default: throw new TypeError(`Invalid [] key in picklist`);
      }
    }

    // Make an object giving the property name and its value.
    var keys           = Object.keys(o);

    if (typeof p === 'function') return p(o, pairs);
    else return explode() . map((p, i) => make_pair(p, i, o));
  };

}

// Given a range from a to b, where either could be negative, meaning count
// from the end, return a list of property descriptors.
// This is generated by the construct `(-2 to 5)`.
// TODO: Does this function need to deal with rest parameters and propNames?
function range(a, b) {
  return function(o, pairs) {
    if (a < 0) a += o.length;
    if (b < 0) b += o.length;

    let range = _range(a, b);

    return range . map((k, i) => make_pair(k, i, o));
  };
}

// Check if object being picked from is an object.
// Invoked by `.?`.
function guard() {
  return function(o) {
    if (!o || typeof o !== 'object') throw new TypeError(`pick on non-object '${o}'`);
  };
}

function object(x) {
  return function(o) {
    return Object.assign({}, ...x(o, []) . filter(not_omitted) . map(make_obj));
  };
}

// Expand calculated k/v pairs into an array to return to the user.
function array(f) {
  return function(o) {
    let pairs = f(o, []);
    let i = 0;

    return pairs . reduce((result, {p, v, n}) => {
      if (n >= 0) i = n;      // Rename means to change index.
      result[i++] = v;
      return result;
    }, []);
  };
}

// Expand a list of k/v pairs into a single return value.
// In theory, the picker oculd return multiple k/v pairs.
// In that case, we pick the first one.
function value(x) {
  return function(o) {
    let pairs = x(o, []);
    let lastPair = pairs[pairs.length - 1];
    if (!lastPair) return undefined;
    var ret = lastPair.v;
    if (typeof ret === 'function') ret = ret.bind(o);
    return ret;
  };
}

var P = {
  object, array, value,
  must, mustnot, omit,
  deflt, rename,
  key, list, rest, range
};

export {
  object, array, value,
  must, mustnot, omit,
  deflt, rename,
  key, list, rest, range
};

console.log(
  modify(
    list(key('a1'), key('a2')),
    deep(
      list(
        key(/^b/),
        key(/^c/)
      )
    )
  )
  ({a1: {b1: 22}, a2: {b2: 42, c: 99}}, [])
);
