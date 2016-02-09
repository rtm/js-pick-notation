import * as P from '..';
import { test } from 'tape';
var o$1099 = { a: 1 };
// PICKING INTO VALUES
test('retrieve named property as value', function (t$1100) {
    t$1100.plan(2);
    t$1100.equal(P.pickObjToVal(o$1099, P.keyset('a')), 1);
    t$1100.equal(P.pickObjToVal(o$1099, P.keyset('a')), 1);
});
test('missing property yields undefined', function (t$1103) {
    t$1103.plan(1);
    t$1103.equal(P.pickObjToVal({}, P.keyset('b')), undefined);
});
test('retrieve nested property', function (t$1105) {
    t$1105.plan(1);
    t$1105.equal(P.pickObjToVal(P.pickObjToVal({ b: o$1099 }, P.keyset('b')), P.keyset('a')), 1);
});
test('retrieve property with computed name', function (t$1108) {
    t$1108.plan(1);
    var prop$1109 = 'a';
    t$1108.deepEqual(P.pickObjToObj(o$1099, [P.keyset(prop$1109)]), o$1099);
});
test('throw when retrieving mandatory property which does not exist', function (t$1111) {
    t$1111.plan(2);
    t$1111.throws(function () {
        P.pickObjToVal(o$1099, P.must(P.keyset('b')));
    });
    t$1111.throws(function () {
        P.pickObjToVal(null, P.must(P.keyset('b')));
    });
});
// PICKING INTO OBJECTS
test('pick property into object', function (t$1114) {
    t$1114.plan(1);
    t$1114.deepEqual(P.pickObjToObj(o$1099, [P.keyset('a')]), o$1099);
});
test('pick renamed property into object', function (t$1116) {
    t$1116.plan(1);
    t$1116.deepEqual(P.pickObjToObj(o$1099, [P.rename(P.keyset('a'), 'b')]), { b: 1 });
});
test('pick missing mandatory property into object', function (t$1118) {
    t$1118.plan(1);
    t$1118.throws(function () {
        P.pickObjToObj(o$1099, [P.must(P.keyset('b'))]);
    });
});
test('pick must-not-exist property into object', function (t$1120) {
    t$1120.plan(1);
    t$1120.throws(function () {
        P.pickObjToObj(o$1099, [P.mustnot(P.keyset('a'))]);
    });
});
test('pick with default value', function (t$1122) {
    t$1122.plan(1);
    t$1122.deepEqual(P.pickObjToObj(o$1099, [P.deflt(P.keyset('b'), 42)]), { b: 42 });
});
test('pick properties from array of name', function (t$1124) {
    t$1124.plan(1);
    var props$1125 = ['a'];
    t$1124.deepEqual(P.pickObjToObj(o$1099, [P.keyset(props$1125)]), { a: 1 });
});
test('pick properties based on regexp', function (t$1127) {
    t$1127.plan(1);
    var regexp$1128 = /a/;
    t$1127.deepEqual(P.pickObjToObj(o$1099, [P.keyset(regexp$1128)]), { a: 1 });
});
test('pick properties based on object properties', function (t$1130) {
    t$1130.plan(1);
    var obj$1131 = { a: 1 };
    t$1130.deepEqual(P.pickObjToObj(o$1099, [P.keyset(obj$1131)]), { a: 1 });
});
test('invalid value* in picklist throws', function (t$1133) {
    t$1133.plan(1);
    var val$1134 = 22;
    t$1133.throws(function () {
        P.pickObjToObj(null, [P.keyset(val$1134)]);
    });
});
test('rest operator picks up all props', function (t$1136) {
    t$1136.plan(1);
    t$1136.deepEqual(P.pickObjToObj(o$1099, [
        P.keyset('a'),
        P.rest()
    ]), o$1099);
});
test('mandatory rest operator', function (t$1138) {
    t$1138.plan(1);
    t$1138.throws(function () {
        P.pickObjToObj(o$1099, [
            P.keyset('a'),
            P.must(P.rest())
        ]);
    });
});
test('pick assignment', function (t$1140) {
    t$1140.plan(1);
    var a$1141;
    a$1141 = P.pickObjToVal(o$1099, P.keyset('a'));
    t$1140.equal(a$1141, 1);
});
test('pick from non-object should throw if #?', function (t$1144) {
    t$1144.plan(1);
    t$1144.throws(function () {
        P.pickObjToObj(P.guard(0), [P.keyset('a')]);
    });
});
// PICK FROM OBJECT INTO ARRAY
test('pick from object into array', function (t$1146) {
    t$1146.plan(1);
    t$1146.deepEqual(P.pickObjToArr(o$1099, [P.keyset('a')]), [1]);
});
test('pick rest from object into array', function (t$1148) {
    t$1148.plan(1);
    t$1148.equal(P.pickObjToArr(o$1099, [P.rest()]).length, 1);
});
test('pick from object into array with rename', function (t$1150) {
    t$1150.plan(1);
    // This will create an array of the form `[undefined, 1]`.
    t$1150.equal(P.pickObjToArr(o$1099, [P.rename(P.keyset('a'), 1)]).length, 2);
});
test('renaming function: uppercase property names', function (t$1152) {
    t$1152.plan(1);
    t$1152.deepEqual(P.pickObjToObj(o$1099, [P.rename(P.rest(), p$1154 => p$1154.toUpperCase())]), { A: 1 });
});
// PICK FROM ARRAY INTO VALUE
// PICK FROM ARRAY INTO ARRAY
test('pick from array into array', function (t$1155) {
    t$1155.plan(1);
    // This will create an array of the form `[undefined, 1]`.
    t$1155.deepEqual(P.pickArrToArr([
        1,
        2
    ], [
        P.keyset(1),
        P.keyset(0)
    ]), [
        2,
        1
    ]);
});
test('pick from array into array using negative index', function (t$1157) {
    t$1157.plan(1);
    t$1157.deepEqual(P.pickArrToArr([
        1,
        2
    ], [
        P.keyset(-1),
        P.keyset(-2)
    ]), [
        2,
        1
    ]);
});
test('pick from array into array using range', function (t$1159) {
    t$1159.plan(1);
    t$1159.deepEqual(P.pickArrToArr([
        1,
        2
    ], [P.pickRange(0, 1)]), [
        1,
        2
    ]);
});
test('reverse array', function (t$1161) {
    t$1161.plan(1);
    t$1161.deepEqual(P.pickArrToArr([
        1,
        2,
        3
    ], [P.pickRange(-1, 0)]), [
        3,
        2,
        1
    ]);
});
test('initialize array', function (t$1163) {
    t$1163.plan(1);
    t$1163.deepEqual(P.pickArrToArr([], [P.deflt(P.pickRange(0, 2), x$1165 => x$1165 * x$1165, true)]), [
        0,
        1,
        4
    ]);
});
test('tail of array by omitting first element', function (t$1166) {
    t$1166.plan(1);
    t$1166.deepEqual(P.pickArrToArr([
        1,
        2
    ], [
        P.omit(P.keyset(0)),
        P.rest()
    ]), [2]);
});
test('splice array', function (t$1168) {
    t$1168.plan(1);
    t$1168.deepEqual(P.pickArrToArr([
        1,
        2,
        3,
        4
    ], [
        P.omit(P.pickRange(1, 2)),
        P.rest()
    ]), [
        1,
        4
    ]);
});
