// Runtime for sweet-based pick operator implementation.
// Define functions `pick` for picking into an object,
// and `pickOne` for picking single values.

const OPERATOR = '.';


// Make a function from a constant, if necessary.
function g(f) { return typeof f === 'function' ? f : () => f; }

// Make a little object from a p/v pair.
const make_obj = desc => ({[desc.p]: desc.v});

// Filter out omitted properties.
const not_omitted = desc => !desc.omit;

// Make a range from one number to another, going up or down.
function _range(a, b) {
  let result = [];

  if (a <= b) while (a <= b) result.push(a++);
  else while (a >= b) result.push(a--);

  return result;
}

// Apply function to elements of array of `{p, v}` property descriptor pairs.
const each = (descs, fn) => { descs.forEach(fn); return descs; };


const omit   = (f)    => (o, opts) => each(f(o, opts), desc => desc.omit = true);
const rename = (f, n) => (o, opts) => each(f(o, opts), (desc, i) => desc.p = desc.n = g(n)(desc.p, i, o));

// Apply a default, either directly, or by calling the provided function,
// which is the case when the default is specified with `:=`.
function deflt(f, d, isFunc) {
  return function(o, opts) {
    return each(f(o, opts), (desc, i) => {
      if (desc.v === undefined)
        desc.v = isFunc ? d(desc.p, i, o) : d;
    });
  };
}

// Implement "must" flag, requiring presence of property.
// Or, for computed properties, require they evaluate to at least one.
function must(f) {
  return function(o, opts) {
    var descs = f(o, opts);
    if (!descs.length) throw new ReferenceError(`Mandatory properties missing`);
    return each(descs, ({p, v}) => {
      if (v === undefined) throw new ReferenceError(`Mandatory property ${p} is missing`);
    });
  };
}

// Implement "nonexist" flag, forbidding presence of property.
// Or, for computed properties, require they evaluate to none.
function mustnot(f) {
  return function(o, opts) {
    var descs = f(o, opts);
    if (descs.length) throw new ReferenceError(`Must-not-exist properties are present`);
    return each(descs, ({p, v}) => {
      if (v !== undefined) throw new ReferenceError(`Must-not-exist property ${p} is present`);
    });
  };
}

// Grab the "rest" of the properties--
// the ones not already mentioned in previous pickers.
function rest() {
  return function(o, opts) {
    let propNames = opts.propNames || [];
    return Object.keys(o) .
      filter(p => !propNames.includes(p) && !propNames.includes(Number(p))) .
      map((p, i) => ({p, i, v: o[p]}));
  };
}

const deep = (base, func) => (o, opts) => {
  const basePairs = base(o, opts);

  var deeps = basePairs.map(basePair => func(basePair.v, opts));
  return [].concat(...deeps);
};

// Based on a list of pickers, return a list of pv pairs.
function pick(funcs) {
  return function(o, opts = {}) {
    const execute = func => func(o, opts);

    return [].concat(...funcs.map(execute)) . filter(not_omitted);
  };
}

// Expand the result of a function returning an array of k/v pairs
// into an object.
// However, this might also be called if a pickfunc is given WITHIN
// a picker, in which case `opts.returnPairs` will be true,
// and the return value is an array of p/v descriptors.
const object = f => (o, opts) => {
  if (typeof opts !== 'object') opts = {propNames: []};
  var pairs = f(o, opts);
  if (opts.returnPairs) return pairs;
  return Object.assign({}, ... pairs . map(make_obj));
};


// Expand a list of k/v pairs into an array to return to the user.
function array(f) {
  return function(o, opts) {
    if (typeof opts !== 'object') opts = {propNames: []};
    let i = 0;
    let pairs = f(o, opts);
    if (opts.returnPairs) return pairs;

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
const value = f => (o, opts) => {
  if (typeof opts !== 'object') opts = {propNames: []};
  let pairs = f(o, opts);
  if (opts.returnPairs) return pairs;
  let firstPair = pairs[0];
  if (!firstPair) return undefined;
  var ret = firstPair.v;
  if (typeof ret === 'function') ret = ret.bind(o);
  return ret;
};

// Given a keyspec, break it down into the keys it refers to.
function key(p) {

  return function(o, {propNames}) {

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
    // Adjust negative array indices to count from end.
    function makeObj(p, i) {
      if (isArray && p < 0) p += o.length;
      propNames.push(p);
      return {p, i, v: o[p]};
    }

    var isArray        = Array.isArray(o);
    var keys           = Object.keys(o);

    if (typeof p === 'function') return p(o, {propNames, returnPairs: true});
    return explode() . map(makeObj);
  };

}

// Given a range from a to b, where either could be negative, meaning count
// from the end, return a list of property descriptors.
// This is generated by the construct `(-2 to 5)`.
// TODO: Does this function need to deal with rest parameters and propNames?
function range(a, b) {
  return function(o, {propNames}) {
    const makeObj = p => ({p, v: o[p]});

    if (a < 0) a += o.length;
    if (b < 0) b += o.length;

    var props = _range(a, b);
    propNames.push(...props);
    return props . map(makeObj);
  };
}


// Check if object being picked from is an object.
// Invoked by `.?`.
function guard(o) {
  if (!o || typeof o !== 'object') throw new TypeError(`${OPERATOR}? pick on non-object ${o}`);
  return o;
}

// Apply a picker to a picked value; used by nested pickers.
// The key to extract is keyfunc, and pickfunc picks from the result.
function apply(keyfunc, pickfunc) {
  return function(o) {
    // This is the key(s) to be picked from, as array of k/v pairs.
    let keyPairs = keyfunc(o, {propNames: []});
    let result = keyPairs . map(({p, i, v}) => ({p, i, v: pickfunc(v, {propNames: []})}));
    return result;
  };
}


export {
  object, array, value,
  pick, key, range, guard, apply, deep,
  omit, deflt, must, mustnot, rename, rest
};
