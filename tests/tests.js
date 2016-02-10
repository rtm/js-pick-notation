import * as P from '..';
import { test } from 'tape';
var o$984 = { a: 1 };
var VALUE_TESTS$985 = true;
var OBJECT_TESTS$986 = true;
// PICKING INTO VALUES
test('pick named property as value', { skip: !VALUE_TESTS$985 }, function (t$987) {
    t$987.plan(2);
    t$987.equal(P.valuePick(P.key('a'))(o$984), 1);
    t$987.equal(P.valuePick(P.key('a'))(o$984), 1);
});
test('pick missing property as value (yields undefined)', { skip: !VALUE_TESTS$985 }, function (t$990) {
    t$990.plan(1);
    t$990.equal(P.valuePick(P.key('b'))({}), undefined);
});
// test.skip('retrieve nested property', function(t) {
//   t.plan(1);
//   t.equal(a # b # {b: o}, 1);
// });
test('pick named property as value', { skip: !VALUE_TESTS$985 }, function (t$992) {
    t$992.plan(1);
    var prop$993 = 'a';
    t$992.equal(P.valuePick(P.key(prop$993))(o$984), 1);
});
test('pick mandatory missing property into value (throws)', { skip: !VALUE_TESTS$985 }, function (t$995) {
    t$995.plan(2);
    t$995.throws(function () {
        P.valuePick(P.must(P.key('b')))(o$984);
    });
    t$995.throws(function () {
        P.valuePick(P.must(P.key('b')))(null);
    });
});
test('pick missing property into value with default', { skip: !VALUE_TESTS$985 }, function (t$998) {
    t$998.plan(1);
    t$998.equal(P.valuePick(P.deflt(P.key('b'), 22))(o$984), 22);
});
test('pick into value using pick function', { skip: !VALUE_TESTS$985 }, function (t$1000) {
    t$1000.plan(2);
    var pickfunc$1002 = P.valuePick(P.key('a'));
    t$1000.equal(typeof pickfunc$1002, 'function');
    t$1000.equal(pickfunc$1002(o$984), 1);
});
test('renaming function: uppercase property names', function (t$1003) {
    t$1003.plan(1);
    t$1003.deepEqual(P.objectPick([P.rename(P.rest(), p$1005 => p$1005.toUpperCase())])(o$984), { A: 1 });
});
// PICKING INTO OBJECTS
test('pick property into object', function (t$1006) {
    t$1006.plan(1);
    t$1006.deepEqual(P.objectPick([P.key('a')])(o$984), o$984);
});
test('pick renamed property into object', function (t$1008) {
    t$1008.plan(1);
    t$1008.deepEqual(P.objectPick([P.rename(P.key('a'), 'b')])(o$984), { b: 1 });
});
test('pick missing mandatory property into object (throws)', function (t$1010) {
    t$1010.plan(1);
    t$1010.throws(function () {
        P.objectPick([P.must(P.key('b'))])(o$984);
    });
});
test('pick must-not-exist property into object (throws)', function (t$1012) {
    t$1012.plan(1);
    t$1012.throws(function () {
        P.objectPick([P.mustnot(P.key('a'))])(o$984);
    });
});
test('pick into object with default value', function (t$1014) {
    t$1014.plan(1);
    t$1014.deepEqual(P.objectPick([P.deflt(P.key('b'), 42)])(o$984), { b: 42 });
});
test('pick properties from array of name into object', function (t$1016) {
    t$1016.plan(1);
    var props$1017 = ['a'];
    t$1016.deepEqual(P.objectPick([P.key(props$1017)])(o$984), { a: 1 });
});
test('pick properties based on regexp', function (t$1019) {
    t$1019.plan(1);
    var regexp$1020 = /a/;
    t$1019.deepEqual(P.objectPick([P.key(regexp$1020)])(o$984), { a: 1 });
});
test('pick properties based on object properties', function (t$1022) {
    t$1022.plan(1);
    var obj$1023 = { a: 1 };
    t$1022.deepEqual(P.objectPick([P.key(obj$1023)])(o$984), { a: 1 });
});
// test.skip('invalid value* in picklist throws', function(t) {
//   t.plan(1);
//   var val = 22;
//   t.throws(function() { {(val)} # null; });
// });
test('rest operator picks up all props', function (t$1025) {
    t$1025.plan(1);
    t$1025.deepEqual(P.objectPick([
        P.key('a'),
        P.rest()
    ])(o$984), o$984);
});
test('mandatory rest with no remaining properties (throws)', function (t$1027) {
    t$1027.plan(1);
    t$1027.throws(function () {
        P.objectPick([
            P.key('a'),
            P.must(P.rest())
        ])(o$984);
    });
});
test('pick from non-object should throw if #?', function (t$1029) {
    t$1029.plan(1);
    t$1029.throws(function () {
        P.objectPick([P.key('a')])(P.guard(null));
    });
});
// PICK INTO ARRAY
test('pick from property into array', function (t$1031) {
    t$1031.plan(1);
    t$1031.deepEqual(P.arrayPick([P.key('a')])(o$984), [1]);
});
test('pick rest from object into array', function (t$1033) {
    t$1033.plan(1);
    t$1033.equal(P.arrayPick([P.rest()])(o$984).length, 1);
});
test('pick from object into array with rename', function (t$1035) {
    t$1035.plan(1);
    // This will create an array of the form `[undefined, 1]`.
    t$1035.equal(P.arrayPick([P.rename(P.key('a'), 1)])(o$984).length, 2);
});
// PICK FROM ARRAY INTO ARRAY
test('swap array elements', function (t$1037) {
    t$1037.plan(1);
    // This will create an array of the form `[undefined, 1]`.
    t$1037.deepEqual(P.arrayPick([
        P.key(1),
        P.key(0)
    ])([
        1,
        2
    ]), [
        2,
        1
    ]);
});
test('pick from array into array using negative index', function (t$1039) {
    t$1039.plan(1);
    t$1039.deepEqual(P.arrayPick([
        P.key(-1),
        P.key(-2)
    ])([
        1,
        2
    ]), [
        2,
        1
    ]);
});
test('pick from array into array using range', function (t$1041) {
    t$1041.plan(1);
    t$1041.deepEqual(P.arrayPick([P.range(0, 1)])([
        1,
        2
    ]), [
        1,
        2
    ]);
});
test('reverse array', function (t$1043) {
    t$1043.plan(1);
    t$1043.deepEqual(P.arrayPick([P.range(-1, 0)])([
        1,
        2,
        3
    ]), [
        3,
        2,
        1
    ]);
});
test('initialize array', function (t$1045) {
    t$1045.plan(1);
    t$1045.deepEqual(P.arrayPick([P.deflt(P.range(0, 2), x$1047 => x$1047 * x$1047, true)])([]), [
        0,
        1,
        4
    ]);
});
test('tail of array by omitting first element', function (t$1048) {
    t$1048.plan(1);
    t$1048.deepEqual(P.arrayPick([
        P.omit(P.key(0)),
        P.rest()
    ])([
        1,
        2
    ]), [2]);
});
test('splice array', function (t$1050) {
    t$1050.plan(1);
    t$1050.deepEqual(P.arrayPick([
        P.omit(P.range(1, 2)),
        P.rest()
    ])([
        1,
        2,
        3,
        4
    ]), [
        1,
        4
    ]);
});
