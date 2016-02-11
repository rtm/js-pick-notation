import * as P from '..';
P.valuePick(P.key(-1));
import { test } from 'tape';
var o$990 = { a: 1 };
var VALUE_TESTS$991 = true;
var OBJECT_TESTS$992 = true;
// PICKING INTO VALUES
test('pick named property as value', { skip: !VALUE_TESTS$991 }, function (t$993) {
    t$993.plan(2);
    t$993.equal(P.valuePick(P.key('a'))(o$990), 1);
    t$993.equal(P.valuePick(P.key('a'))(o$990), 1);
});
test('pick missing property as value (yields undefined)', { skip: !VALUE_TESTS$991 }, function (t$999) {
    t$999.plan(1);
    t$999.equal(P.valuePick(P.key('b'))({}), undefined);
});
//test.skip('retrieve nested property', function(t) {
// //   t.plan(1);
// //   t.equal(a # b # {b: o}, 1);
// // });
test('pick named property as value', { skip: !VALUE_TESTS$991 }, function (t$1003) {
    t$1003.plan(1);
    var prop$1005 = 'a';
    t$1003.equal(P.valuePick(P.key(prop$1005))(o$990), 1);
});
test('pick mandatory missing property into value (throws)', { skip: !VALUE_TESTS$991 }, function (t$1008) {
    t$1008.plan(2);
    t$1008.throws(function () {
        P.valuePick(P.must(P.key('b')))(o$990);
    });
    t$1008.throws(function () {
        P.valuePick(P.must(P.key('b')))(null);
    });
});
test('pick missing property into value with default', { skip: !VALUE_TESTS$991 }, function (t$1014) {
    t$1014.plan(1);
    t$1014.equal(P.valuePick(P.deflt(P.key('b'), 22))(o$990), 22);
});
test('pick into value using pick function', { skip: !VALUE_TESTS$991 }, function (t$1018) {
    t$1018.plan(2);
    var pickfunc$1021 = P.valuePick(P.key('a'));
    t$1018.equal(typeof pickfunc$1021, 'function');
    t$1018.equal(pickfunc$1021(o$990), 1);
});
// PICKING INTO OBJECTS
test('renaming function: uppercase property names', function (t$1024) {
    t$1024.plan(1);
    t$1024.deepEqual(P.objectPick([P.rename(P.rest(), p$1031 => p$1031.toUpperCase())])(o$990), { A: 1 });
});
test('pick property into object', function (t$1032) {
    t$1032.plan(1);
    t$1032.deepEqual(P.objectPick([P.key('a')])(o$990), o$990);
});
test('pick renamed property into object', function (t$1036) {
    t$1036.plan(1);
    t$1036.deepEqual(P.objectPick([P.rename(P.key('a'), 'b')])(o$990), { b: 1 });
});
test('pick missing mandatory property into object (throws)', function (t$1040) {
    t$1040.plan(1);
    t$1040.throws(function () {
        P.objectPick([P.must(P.key('b'))])(o$990);
    });
});
test('pick must-not-exist property into object (throws)', function (t$1044) {
    t$1044.plan(1);
    t$1044.throws(function () {
        P.objectPick([P.mustnot(P.key('a'))])(o$990);
    });
});
test('pick into object with default value', function (t$1048) {
    t$1048.plan(1);
    t$1048.deepEqual(P.objectPick([P.deflt(P.key('b'), 42)])(o$990), { b: 42 });
});
test('pick properties from array of name into object', function (t$1052) {
    t$1052.plan(1);
    var props$1054 = ['a'];
    t$1052.deepEqual(P.objectPick([P.key(props$1054)])(o$990), { a: 1 });
});
test('pick properties based on regexp', function (t$1057) {
    t$1057.plan(1);
    var regexp$1059 = /a/;
    t$1057.deepEqual(P.objectPick([P.key(regexp$1059)])(o$990), { a: 1 });
});
test('pick properties based on object properties', function (t$1062) {
    t$1062.plan(1);
    var obj$1064 = { a: 1 };
    t$1062.deepEqual(P.objectPick([P.key(obj$1064)])(o$990), { a: 1 });
});
//test.skip('invalid value* in picklist throws', function(t) {
//   t.plan(1);
//   var val = 22;
//   t.throws(function() { {(val)}. null; });
// });
test('rest operator picks up all props', function (t$1067) {
    t$1067.plan(1);
    t$1067.deepEqual(P.objectPick([
        P.key('a'),
        P.rest()
    ])(o$990), o$990);
});
test('mandatory rest with no remaining properties (throws)', function (t$1071) {
    t$1071.plan(1);
    t$1071.throws(function () {
        P.objectPick([
            P.key('a'),
            P.must(P.rest())
        ])(o$990);
    });
});
test('pick from non-object should throw if #?', function (t$1075) {
    t$1075.plan(1);
    t$1075.throws(function () {
        P.objectPick([P.key('a')])(P.guard(null));
    });
});
// // PICK INTO ARRAY
test('pick from property into array', function (t$1079) {
    t$1079.plan(1);
    t$1079.deepEqual(P.arrayPick([P.key('a')])(o$990), [1]);
});
test('pick rest from object into array', function (t$1083) {
    t$1083.plan(1);
    t$1083.equal(P.arrayPick([P.rest()])(o$990).length, 1);
});
test('pick from object into array with rename', function (t$1088) {
    t$1088.plan(1);
    // This will create an array of the form `[undefined, 1]`.
    t$1088.equal(P.arrayPick([P.rename(P.key('a'), 1)])(o$990).length, 2);
});
// PICK FROM ARRAY INTO ARRAY
test('swap array elements', function (t$1093) {
    t$1093.plan(1);
    // This will create an array of the form `[undefined, 1]`.
    t$1093.deepEqual(P.arrayPick([
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
test('pick from array into array using negative index', function (t$1097) {
    t$1097.plan(1);
    t$1097.deepEqual(P.arrayPick([
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
test('pick from array into array using range', function (t$1101) {
    t$1101.plan(1);
    t$1101.deepEqual(P.arrayPick([P.range(0, 1)])([
        1,
        2
    ]), [
        1,
        2
    ]);
});
test('reverse array', function (t$1105) {
    t$1105.plan(1);
    t$1105.deepEqual(P.arrayPick([P.range(-1, 0)])([
        1,
        2,
        3
    ]), [
        3,
        2,
        1
    ]);
});
test('initialize array', function (t$1109) {
    t$1109.plan(1);
    t$1109.deepEqual(P.arrayPick([P.deflt(P.range(0, 2), x$1113 => x$1113 * x$1113, true)])([]), [
        0,
        1,
        4
    ]);
});
test('tail of array by omitting first element', function (t$1114) {
    t$1114.plan(1);
    t$1114.deepEqual(P.arrayPick([
        P.omit(P.key(0)),
        P.rest()
    ])([
        1,
        2
    ]), [2]);
});
test('splice array', function (t$1118) {
    t$1118.plan(1);
    t$1118.deepEqual(P.arrayPick([
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
