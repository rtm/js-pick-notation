import test from 'tape';


var o = {a: 1};

var VALUE_TESTS = true;
var OBJECT_TESTS = true;

// DEEP PICK
// test('deep pick', function(t) {
//   t.plan(2);
//   t.deepEqual(
//     {a: {b: 1}}.{a.b},
//     {b: 1}
//   );
//   t.deepEqual(
//     {a: {b: {c: 1}}}.{a.b.c},
//     {c: 1}
//   );
// });

// PICKING INTO VALUES

test('pick named property as value', {skip: !VALUE_TESTS}, function (t) {
  t.plan(2);
  t.equal(o.(a), 1);
  t.equal(o.('a'), 1);
});

test('pick missing property as value (yields undefined)', {skip: !VALUE_TESTS}, function(t) {
  t.plan(1);
  t.equal({}.(b), undefined);
});

//test.skip('retrieve nested property', function(t) {
// //   t.plan(1);
// //   t.equal(a # b # {b: o}, 1);
// // });

test('pick named property as value', {skip: !VALUE_TESTS}, function(t) {
  t.plan(1);
  var prop = 'a';
  t.equal(o.((prop)), 1);
});

test('pick mandatory missing property into value (throws)', {skip: !VALUE_TESTS}, function (t) {
  t.plan(2);
  t.throws(function() { o.(b!); });
  t.throws(function() { null.(b!); });
});

test('pick missing property into value with default', {skip: !VALUE_TESTS}, function (t) {
  t.plan(1);
  t.equal(o.(b=22), 22);
});

test('pick into value using pick function', {skip: !VALUE_TESTS}, function(t) {
  t.plan(2);
  var pickfunc = .(a);
  t.equal(typeof pickfunc, "function");
  t.equal(pickfunc(o), 1);
});


// PICKING INTO OBJECTS

//test('renaming function: uppercase property names', function(t) {
//  t.plan(1);
//  // TODO: figure out why double parentheses are needed here.
//  t.deepEqual(o.{* -> ((p => p.toUpperCase()))}, {A: 1});
//});

test('pick property into object', function(t) {
  t.plan(1);
  t.deepEqual(o.{a}, o);
});

test('pick renamed property into object', function(t) {
  t.plan(1);
  t.deepEqual(o.{a -> b}, {b: 1});
});

test('pick missing mandatory property into object (throws)', function(t) {
  t.plan(1);
  t.throws(function() { o.{b!}; });
});

test('pick must-not-exist property into object (throws)', function(t) {
  t.plan(1);
  t.throws(function() { o.{a^}; });
});

test('pick into object with default value', function(t) {
  t.plan(1);
  t.deepEqual(o.{b = 42}, {b: 42});
});

test('pick properties from array of name into object', function(t) {
  t.plan(1);
  var props = ['a'];
  t.deepEqual(o.{(props)}, {a: 1});
});

test('pick properties based on regexp', function(t) {
  t.plan(1);
  var regexp = /a/;
  t.deepEqual(o.{(regexp)}, {a: 1});
});

test('pick properties based on object properties', function(t) {
  t.plan(1);
  var obj = {a: 1};
  t.deepEqual(o.{(obj)}, {a: 1});
});

//test.skip('invalid value* in picklist throws', function(t) {
//   t.plan(1);
//   var val = 22;
//   t.throws(function() { {(val)}. null; });
// });

test('rest operator picks up all props', function(t) {
  t.plan(1);
  t.deepEqual(o.{a, *}, o);
});

test('mandatory rest with no remaining properties (throws)', function(t) {
  t.plan(1);
  t.throws(function() {
    o. {a, *!};
  });
});

test('pick from non-object should throw if #?', function(t) {
  t.plan(1);
  t.throws(function() { null.?{ a } });
});

// // PICK INTO ARRAY

test('pick from property into array', function(t) {
  t.plan(1);
  t.deepEqual(o.[a], [1]);
});

test('pick rest from object into array', function(t) {
  t.plan(1);
  t.equal((o.[*]).length, 1);
});

test('pick from object into array with rename', function(t) {
  t.plan(1);
  // This will create an array of the form `[undefined, 1]`.
  t.equal((o.[a -> 1]).length, 2);
});


// PICK FROM ARRAY INTO ARRAY

test('swap array elements', function(t) {
  t.plan(1);
  // This will create an array of the form `[undefined, 1]`.
  t.deepEqual(
    [1, 2].[1, 0],
    [2, 1]
  );
});

test('pick from array into array using negative index', function(t) {
  t.plan(1);
  t.deepEqual(
    [1, 2].[-1, -2],
    [2, 1]
  );
});

test('pick from array into array using range', function(t) {
  t.plan(1);
  t.deepEqual(
    [1, 2].[0 to 1],
    [1, 2]
  );
});

test('reverse array', function(t) {
  t.plan(1);
  t.deepEqual(
    [1, 2, 3].[-1 to 0],
    [3, 2, 1]
  );
});

test('initialize array', function(t) {
  t.plan(1);
  t.deepEqual(
    [].[0 to 2 := (x => x * x)],
    [0, 1, 4]
  );
});

test('tail of array by omitting first element', function(t) {
  t.plan(1);
  t.deepEqual(
    [1, 2].[0~, *],
    [2]
  );
});

test('splice array', function(t) {
  t.plan(1);
  t.deepEqual(
    [1, 2, 3, 4].[1 to 2~, *],
    [1, 4]
  );
});

test('clone array', function(t) {
  t.plan(1);
  t.deepEqual(
    [1, 2].[*],
    [1, 2]
  );
});

test('flatten array', function(t) {
  t.plan(1);
  t.deepEqual(
    [[1, 2], [3, 4]].[*.*],
    [1, 2, 3, 4]
  );
});

test('clone array to two levels', function(t) {
  var a = [[1, 2], [3, 4]];
  t.plan(1);
  t.deepEqual(a.[*:[*]], a);
});

test('pick first element of each subarray', function(t) {
  t.plan(1);
  t.deepEqual(
    [[1, 2], [3, 4]].[* . 0],
    [1, 3]
  );
});

test('take first element of each subarray', function(t) {
  t.plan(1);
  t.deepEqual(
    [[1, 2], [3, 4]].[*: [0]],
    [[1], [3]]
  );
});

// When the property picked is a function, we must adjust the `this`
// in order to allow it to be called properly.
test('this handling', function(t) {
  t.plan(1);
  var o = { v: 42, f: function() { return this.v; } };
  var picker = .f;
  t.equal(picker(o)(), 42);
});

// NESTED PICKS

test('nested pick', function(t) {
  t.plan(1);
  t.deepEqual(
    {a: {b: 1}}.{a:{b}},
    {a: {b: 1}}
  );
});

// Pick funcs
test('pickfuncs as pickelts', function(t) {
  var o = {a: 1, b: 2};
  t.plan(3);
  t.deepEqual(o.{.a}, {a: 1});
  t.deepEqual(o.{.a, .b}, o);
  t.deepEqual(o.{.a, .*}, o, 'rest as function');
});

test('pickfunc from array of objects', function(t) {
  t.plan(1);
  var o = [{a: 1}, {a: 2}];
  t.deepEqual(o.map(.a), [1, 2]);
});

// Grouped picks
test('grouped pick', function(t) {
  t.plan(4);

  // Basic grouped pick.
  t.deepEquals(
    {a: 1, b: 2, c: 3}.{{a, b}},
    {a: 1, b: 2},
    "Basic grouped pick"
  );

  // Apply renaming func to all members of group.
  t.deepEquals(
    {a: 1, b: 2, c: 3}.{{a, b} -> (p => p + "1")},
    {a1: 1, b1: 2},
    "Renaming grouped pick"
  );

  // Apply renaming func with index to all members of group.
  t.deepEquals(
    {a: 1, b: 2, c: 3}.{{a, b} -> ((p, i) => "x" + i)},
    {x0: 1, x1: 2},
    "Renaming grouped pick with index"
  );

  // Apply must-not operator to all members of group.
  t.throws(
    function() {
      {a: 1, b: 2, c: 3}.{{a, b}^};
    }
  );
});
