// Runtime for sweet-based pick operator implementation.
// Define functions `pick` for picking into an object,
// and `pickOne` for picking single values.

// Create an object from another object,
// whose properties are given by an array of property descriptors.
function pick(o, props) {

  var anyMandatory    = props.some(p => p.f);
  var anyMustNotExist = props.some(p => p.x);

  if (!o || typeof o !== 'object') {
    if (anyMandatory) throw new ReferenceError(`pick from non-object`);
    return {};
  }

  var keys = Object.keys(o);

  return props.reduce((r, {p, f, n, d, x}) => {

    // Handle properties defined by `props`, adding result to `r`.
    function handle(props) {

      function handleOne(p) {
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

        r[newname] = val;
      }

      // "Mandatory" means that there must be at least one property,
      // and all properties must exit on the target object.
      if (f && props.length && !props . every(p => p in o))
        throw new ReferenceError(`Missing property in object`);

      props.forEach(handleOne);
    }

    var props;

    switch (Object.prototype.toString.call(p)) {
      case '[object Array]'   : props = (p);                           break;
      case '[object Object]'  : props = keys;                          break;
      case '[object RegExp]'  : props = keys . filter(k => p.test(k)); break;
      case '[object String]'  : props = [p];                           break;
      case '[object Function]': props = keys . filter(p);              break;
    }

    handle(props);

    return r;
  }, {});
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
