// Runtime for sweet-based pick operator implementation.
// Define functions `pick` for picking into an object,
// and `pickOne` for picking single values.


// Make a function from a constant, if necessary.
function g(f) { return typeof f === 'function' ? f : () => f; }

// Make a range from one number to another, going up or down.
function range(a, b) {
  let result = [];

  if (a <= b) while (a <= b) result.push(a++);
  else while (a >= b) result.push(a--);

  return result;
}

// Apply function to elements of array of `{p, v}` property descriptor pairs.
const each = (descs, fn) => { descs.forEach(fn); return descs; };


const omit   = (f)    => ctx     => each(f(ctx), desc => desc.omit = true);
const deflt  = (f, d) => ctx     => each(f(ctx), desc => { if (desc.v === undefined) desc.v = g(d)(desc.p, ctx.o); });
const rename = (f, n) => ctx     => each(f(ctx), desc => desc.p = desc.n = g(n)(desc.p, ctx.o));


// Implement "mandatory" flag, requiring presence of property.
// Or, for computed properties, require they evaluate to at least one.
const mandatory = f => ctx => {
  var descs = f(ctx);
  if (!descs.length) throw new ReferenceError(`Mandatory properties missing`);
  return each(descs, ({p, v}) => {
    if (v === undefined) throw new ReferenceError(`Mandatory property ${p} is missing`);
  });
};

// Implement "nonexist" flag, forbidding presence of property.
// Or, for computed properties, require they evaluate to none.
const notexist = f => ctx => {
  var descs = f(ctx);
  if (descs.length) throw new ReferenceError(`Must-not-exist properties are present`);
  return each(descs, ({p, v}) => {
    if (v !== undefined) throw new ReferenceError(`Must-not-exist property ${p} is present`);
  });
};

// Grab the "rest" of the properties--
// the ones not already mentioned in previous pickers.
const rest = f => ({o, propNames}) =>
        Object.keys(o) .
        filter(p => !propNames.includes(p)) .
        map(p => ({p, v: o[p]}));


// Pick a bunch of picks into an object.
function pickObjToObj(o, funcs) {
  const propNames   = [];
  const make_obj    = desc => ({[desc.p]: desc.v});
  const not_omitted = desc => !desc.omit;
  const execute     = func => func({o, propNames});

  const props   = [].concat(...funcs.map(execute));
  const objs    = props . filter(not_omitted) . map(make_obj);

  return Object.assign({}, ...objs);
}

// Handle construct like `[a] # o`.
function pickObjToArr(o, funcs) {
  let i             = 0;
  const result      = [];
  const propNames   = [];
  const not_omitted = desc => !desc.omit;
  const execute     = func => func({o, propNames});

  const props   = [].concat(...funcs.map(execute));

  props. filter(not_omitted) . forEach(({p, v}) => {
    // If the renamed prop is an integer, use that as new starting index.
    if (p >= 0) i = p;

    result[i++] = v;
  });

  return result;
}

// Pick a value from an object, based on construct of form `a # b`.
function pickObjToVal(o, func) {
  var result = pickObjToObj(o, [func]);
  var keys   = Object.keys(result);
  if (!keys.length) return undefined;
  return o[keys[0]];
}

// Pick an array into an array (`[1, 0] @ [a, b]`)
// Is this any different from pickObjToArr?
function pickArrToArr(o, funcs) {
  let i             = 0;
  const result      = [];
  const propNames   = [];
  const not_omitted = desc => !desc.omit;
  const execute     = func => func({o, propNames});

  const props   = [].concat(...funcs.map(execute));

  props. filter(not_omitted) . forEach(({p, v, n}) => {
    // If the renamed prop is an integer, use that as new starting index.
    if (n >= 0) i = n;

    result[i++] = v;
  });

  return result;
}

// Pick an array into an object (`{1: a, 0: b} @ [a, b]`)
function pickArrToObj(a, funcs) {

}

// Pick an array into an value (`-1 @ [1,2]1`
function pickArrToVal(a, func) {
}

function pick1(p) {

  return function(ctx) {

    // Expand a property descriptor into a list of actual property names.
    function explode() {
      switch (Object.prototype.toString.call(p)) {
        case '[object Array]'    : return p;
        case '[object Object]'   : return keys;
        case '[object RegExp]'   : return keys . filter(k => p.test(k));
        case '[object Number]'   :
        case '[object String]'   : return [p];
        case '[object Function]' : return keys . filter(p);
        case '[object Undefined]': return [];
        default: throw new TypeError(`Invalid [] key in picklist`);
      }
    }

    // Make an object giving the property name and its value.
    function makeObj(p) {
      let v = o[p];
      if (isArray && p < 0) v = o[o.length + p];
      return {p, v};
    }

    var {o, propNames} = ctx;
    var isArray = Array.isArray(o);

    console.log("***o is***", o);
    var keys = Object.keys(o);
    propNames.push(...p);

    return explode() . map(makeObj);
  };

}

// Given a range from a to b, where either could be negative, meaning count
// from the end, return a list of property descriptors.
// This is generated by the construct `(-2...5)`.
// TODO: Does this function need to deal with rest parameters and propNames?
function pickRange(a, b) {
  return function(ctx) {
    var {o, propNames} = ctx;
    const makeObj = p => ({p, v: o[p]});

    if (a < 0) a += o.length;
    if (b < 0) b += o.length;

    var props = range(a, b);
    propNames.push(props);
    return props . map(makeObj);
  };
}


// Check if object being picked from is an object.
// Invoked by `#?`.
function check(o) {
  if (typeof o !== 'object') throw new TypeError(`#? pick on non-object ${o}`);
  return o;
}


export {
  pickObjToObj, pickObjToArr, pickObjToVal,
  pickArrToObj, pickArrToArr, pickArrToVal,
  pick1, pickRange,
  omit, deflt, mandatory, rename, rest, check
};
