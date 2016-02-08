// Runtime for sweet-based pick operator implementation.
// Define functions `pick` for picking into an object,
// and `pickOne` for picking single values.


// Make a function from a constant, if necessary.
function g(f) { return typeof f === 'function' ? f : () => f; }

// Apply process to elements of array of `{p, v}` property descriptor pairs.
const each = (descs, fn) => { descs.forEach(fn); return descs; };


const omit   = (f)    => (o)     => each(f(o), desc => desc.omit = true);
const deflt  = (f, d) => (o)     => each(f(o), desc => { if (desc.v === undefined) desc.v = d(desc.p, o); });
const rename = (f, n) => (o)     => each(f(o), desc => desc.p = n(desc.p, o));
const rest   = (f)    => (o, fn) => { fn(f); return []; };


// Implement "mandatory" flag, requiring presence of property.
// Or, for computed properties, require they evaluate to at least one.
const mandatory = f => o => {
  var descs = f(o);
  if (!descs.length) throw new ReferenceError(`Mandatory properties missing`);
  return each(descs, ({p, v}) => {
    if (v === undefined) throw new ReferenceError(`Mandatory property ${p} is missing`);
  });
};

// Implement "nonexist" flag, forbidding presence of property.
// Or, for computed properties, require they evaluate to none.
const notexist = f => o => {
  var descs = f(o);
  if (descs.length) throw new ReferenceError(`Must-not-exist properties are present`);
  return each(descs, ({p, v}) => {
    if (v !== undefined) throw new ReferenceError(`Must-not-exist property ${p} is present`);
  });
};



function pickObj(o, funcs) {
  let rest;

  const catchRest   = f => {
    if (rest) throw new SyntaxError(`Cannot have Two rest properties in one picklist`);
    rest = f;
  };


  const make_obj    = desc => ({[desc.p]: desc.v});
  const not_omitted = desc => !desc.omit;
  const execute     = func => func(o, catchRest);

  const props   = [].concat(...funcs.map(execute));
  const objs    = props . filter(not_omitted) . map(make_obj);

  return Object.assign({}, ...objs);
}

function pick1(p) {

  return function(o) {

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

    var keys = Object.keys(o);

    return explode() . map(p => ({p, v: o[p]}));
  };

}


var fuck = rename(pick1(['b1', 'b2']), x => x+1)({b1:1});
console.log(fuck);

console.log(pick({b1:1}, [notexist(pick1(['b1', 'b2']))]));

export {pickObj, pick1, omit, deflt, mandatory, rename, rest};
