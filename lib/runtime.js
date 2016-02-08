// Runtime for sweet-based pick operator implementation.
// Define functions `pick` for picking into an object,
// and `pickOne` for picking single values.


// Make a function from a constant, if necessary.
function g(f) { return typeof f === 'function' ? f : () => f; }

// Apply function to elements of array of `{p, v}` property descriptor pairs.
const each = (descs, fn) => { descs.forEach(fn); return descs; };


const omit   = (f)    => ctx     => each(f(ctx), desc => desc.omit = true);
const deflt  = (f, d) => ctx     => each(f(ctx), desc => { if (desc.v === undefined) desc.v = g(d)(desc.p, ctx.oo); });
const rename = (f, n) => ctx     => each(f(ctx), desc => desc.p = g(n)(desc.p, ctx.o));


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
function pickObj(o, funcs) {
  const propNames   = [];
  const make_obj    = desc => ({[desc.p]: desc.v});
  const not_omitted = desc => !desc.omit;
  const execute     = func => func({o, propNames});

  const props   = [].concat(...funcs.map(execute));
  const objs    = props . filter(not_omitted) . map(make_obj);

  return Object.assign({}, ...objs);
}

// Pick a value, based on construct of form `a # b`.
function pickVal(o, func) {
  var result = pickObj(o, [func]);
  var keys   = Object.keys(result);
  if (!keys.length) return undefined;
  return o[keys[0]];
}


function pick1(p) {

  return function(ctx) {

    // Expand a property descriptor into a list of actual property names.
    function explode() {
      switch (Object.prototype.toString.call(p)) {
        case '[object Array]'    : return p;
        case '[object Object]'   : return keys;
        case '[object RegExp]'   : return keys . filter(k => p.test(k));
        case '[object String]'   : return [p];
        case '[object Function]' : return keys . filter(p);
        case '[object Undefined]': return [];
        default: throw new TypeError(`Invalid [] key in picklist`);
      }
    }

    var {o, propNames} = ctx;
    var keys = Object.keys(o);
    propNames.push(...p);

    return explode() . map(p => ({p, v: o[p]}));
  };

}



// Check if object being picked from is an object.
// Invoked by `#?`.
function check(o) {
  if (typeof o !== 'object') throw new TypeError(`#? pick on non-object ${o}`);
  return o;
}


export {pickObj, pickVal, pick1, omit, deflt, mandatory, rename, rest, check};
