import test from 'tape';


var o = {a: 1};

var VALUE_TESTS = true;
var OBJECT_TESTS = true;

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

test('renaming function: uppercase property names', function(t) {
  t.plan(1);
  t.deepEqual(o.{...: (p => p.toUpperCase())}, {A: 1});
});

test('pick property into object', function(t) {
  t.plan(1);
  t.deepEqual(o.{a}, o);
});

test('pick renamed property into object', function(t) {
  t.plan(1);
  t.deepEqual(o.{a: b}, {b: 1});
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
  t.deepEqual(o.{a, ...}, o);
});

test('mandatory rest with no remaining properties (throws)', function(t) {
  t.plan(1);
  t.throws(function() {
    o. {a, ...!};
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
  t.equal((o.[...]).length, 1);
});

test('pick from object into array with rename', function(t) {
  t.plan(1);
  // This will create an array of the form `[undefined, 1]`.
  t.equal((o.[a: 1]).length, 2);
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
    [1, 2].[0 ...1],
    [1, 2]
  );
});

test('reverse array', function(t) {
  t.plan(1);
  t.deepEqual(
    [1, 2, 3].[-1 ...0],
    [3, 2, 1]
  );
});

test('initialize array', function(t) {
  t.plan(1);
  t.deepEqual(
    [].[0 ...2 := (x => x * x)],
    [0, 1, 4]
  );
});

test('tail of array by omitting first element', function(t) {
  t.plan(1);
  t.deepEqual(
    [1, 2].[0~, ...],
    [2]
  );
});

test('splice array', function(t) {
  t.plan(1);
  t.deepEqual(
    [1, 2, 3, 4].[1 ...2~, ...],
    [1, 4]
  );
});
