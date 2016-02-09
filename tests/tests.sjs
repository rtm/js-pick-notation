import test from 'tape';


var o = {a: 1};

// PICKING INTO VALUES

test('retrieve named property as value', function (t) {
  t.plan(2);
  t.equal( a  # o, 1);
  t.equal('a' # o, 1);
});

test('missing property yields undefined', function(t) {
  t.plan(1);
  t.equal(b # {}, undefined);
});

test('retrieve nested property', function(t) {
  t.plan(1);
  t.equal(a # b # {b: o}, 1);
});

test('retrieve property with computed name', function(t) {
  t.plan(1);
  var prop = 'a';
  t.deepEqual({(prop)} # o, o);
});

test('throw when retrieving mandatory property which does not exist', function (t) {
  t.plan(2);
  t.throws(function() { b! # o; });
  t.throws(function() { b! # null; });
});


// PICKING INTO OBJECTS

test('pick property into object', function(t) {
  t.plan(1);
  t.deepEqual({a} # o, o);
});

test('pick renamed property into object', function(t) {
  t.plan(1);
  t.deepEqual({a:b} # o, {b: 1});
});

test('pick missing mandatory property into object', function(t) {
  t.plan(1);
  t.throws(function() { {b!} # o; });
});

test('pick must-not-exist property into object', function(t) {
  t.plan(1);
  t.throws(function() { {a^} # o; });
});

test('pick with default value', function(t) {
  t.plan(1);
  t.deepEqual({b = 42} # o, {b: 42});
});

test('pick properties from array of name', function(t) {
  t.plan(1);
  var props = ['a'];
  t.deepEqual({(props)} # o, {a: 1});
});

test('pick properties based on regexp', function(t) {
  t.plan(1);
  var regexp = /a/;
  t.deepEqual({(regexp)} # o, {a: 1});
});

test('pick properties based on object properties', function(t) {
  t.plan(1);
  var obj = {a: 1};
  t.deepEqual({(obj)} # o, {a: 1});
});

test('invalid value* in picklist throws', function(t) {
  t.plan(1);
  var val = 22;
  t.throws(function() { {(val)} # null; });
});

test('rest operator picks up all props', function(t) {
  t.plan(1);
  t.deepEqual({a, ...} # o, o);
});

test('mandatory rest operator', function(t) {
  t.plan(1);
  t.throws(function() {
    {a, ... !} # o;
  });
});

test('pick assignment', function(t) {
  t.plan(1);
  var a;
  a #= o;
  t.equal(a, 1);
});

test('pick from non-object should throw if #?', function(t) {
  t.plan(1);
  t.throws(function() { { a } #? 0 });
});

// PICK FROM OBJECT INTO ARRAY

test('pick from object into array', function(t) {
  t.plan(1);
  t.deepEqual([a] # o, [1]);
});

test('pick rest from object into array', function(t) {
  t.plan(1);
  t.equal(([...] # o).length, 1);
});

test('pick from object into array with rename', function(t) {
  t.plan(1);
  // This will create an array of the form `[undefined, 1]`.
  t.equal(([a:1] # o).length, 2);
});

test('renaming function: uppercase property names', function(t) {
  t.plan(1);
  t.deepEqual({...: (p => p.toUpperCase())} # o, {A: 1});
});

// PICK FROM ARRAY INTO VALUE

// PICK FROM ARRAY INTO ARRAY
test('pick from array into array', function(t) {
  t.plan(1);
  // This will create an array of the form `[undefined, 1]`.
  t.deepEqual(
    [1, 0] @ [1, 2],
    [2, 1]
  );
});

test('pick from array into array using negative index', function(t) {
  t.plan(1);
  t.deepEqual(
    [-1, -2] @ [1, 2],
    [2, 1]
  );
});

test('pick from array into array using range', function(t) {
  t.plan(1);
  t.deepEqual(
    [0 to 1] @ [1, 2],
    [1, 2]
  );
});

test('reverse array', function(t) {
  t.plan(1);
  t.deepEqual(
    [-1 to 0] @ [1, 2, 3],
    [3, 2, 1]
  );
});

// // PICK FROM ARRAY INTO OBJECT
