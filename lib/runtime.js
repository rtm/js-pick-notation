// Runtime for sweet-based pick operator implementation.
// Define functions `pick` for picking into an object,
// and `pickOne` for picking single values.

// Create an object from another object,
// whose properties are given by an array of property descriptors.
function pick(o, ds) {

  var anyMandatory    = ds.some(d => d.f);
  var anyMustNotExist = ds.some(d => d.x);

  if (!o || typeof o !== 'object') {
    if (anyMandatory) throw new ReferenceError(`pick from non-object`);
    return {};
  }

  var keys = Object.keys(o);
  var result = {};

  // Fill in `ps` property, containing array of actual property names.
  ds.forEach(d => {
    var p = d.p;
    switch (Object.prototype.toString.call(p)) {
      case '[object Array]'    : d.ps = p;                             break;
      case '[object Object]'   : d.ps = keys;                          break;
      case '[object RegExp]'   : d.ps = keys . filter(k => p.test(k)); break;
      case '[object String]'   : d.ps = [p];                           break;
      case '[object Function]' : d.ps = keys . filter(p);              break;
      case '[object Undefined]': d.ps = [];                            break;
      default: throw new TypeError(`Invalid [] key in picklist`);
    }
  });

  var allProps = [].concat(...ds.map(d => d.ps));

  var rest = ds.find(d => !d.p);
  if (rest) {
    rest.ps = keys.filter(k => !allProps.includes(k));
    if (rest.x &&  rest.ps.length) throw new ReferenceError("No rest properties allowed");
    if (rest.f && !rest.ps.length) throw new ReferenceError("Rest properties must be present");
  }

  // For each descriptor, fill in properties on result object.
  ds.forEach(({ps, f, n, d, x, m}) => {

    // Omit properties suffixed by `-`.
    if (m) return;

    ps.forEach(p => {
      let val = o[p];

      // Handle missing values and defaults.
      if (val === undefined) {
        if (d !== undefined) val = d;
        else return;
      }

      // Check for properties which must not exist.
      if (x && p in o) throw new ReferenceError(`Property '${p}' exists when it must not`);

      // Calculate property name.
      let newname = !n ? p : typeof n === 'function' ? n(p, o) : n;

      result[newname] = val;
    });

    // "Mandatory" means that there must be at least one property,
    // and all properties must exit on the target object.
    if (f && ps.length && !ps . every(p => p in o))
      throw new ReferenceError(`Missing property in object`);
  });

  return result;
}

// Return a value from an object based on a property descriptor.
function pickOne(o, {p, f}) {
  if (f) {
    if (!o || typeof o !== 'object') throw new ReferenceError(`Pick from non-object`);
    if (!(p in o))                   throw new ReferenceError(`Missing property ${p} in object`);
  }
  return o[p];
}

export {pick, pickOne};
