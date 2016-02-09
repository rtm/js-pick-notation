import * as P from '..';
P.rename(P.rest(), a$1095 => a$1095);
import { test } from 'tape';
var o$1094 = { a: 1 };
// PICKING INTO VALUES
test('retrieve named property as value', function (t$1096) {
    t$1096.plan(2);
    t$1096.equal(P.pickObjToVal(o$1094, P.keyset('a')), 1);
    t$1096.equal(P.pickObjToVal(o$1094, P.keyset('a')), 1);
});
test('missing property yields undefined', function (t$1099) {
    t$1099.plan(1);
    t$1099.equal(P.pickObjToVal({}, P.keyset('b')), undefined);
});
test('retrieve nested property', function (t$1101) {
    t$1101.plan(1);
    t$1101.equal(P.pickObjToVal(P.pickObjToVal({ b: o$1094 }, P.keyset('b')), P.keyset('a')), 1);
});
test('retrieve property with computed name', function (t$1104) {
    t$1104.plan(1);
    var prop$1105 = 'a';
    t$1104.deepEqual(P.pickObjToObj(o$1094, [P.keyset(prop$1105)]), o$1094);
});
test('throw when retrieving mandatory property which does not exist', function (t$1107) {
    t$1107.plan(2);
    t$1107.throws(function () {
        P.pickObjToVal(o$1094, P.must(P.keyset('b')));
    });
    t$1107.throws(function () {
        P.pickObjToVal(null, P.must(P.keyset('b')));
    });
});
// PICKING INTO OBJECTS
test('pick property into object', function (t$1110) {
    t$1110.plan(1);
    t$1110.deepEqual(P.pickObjToObj(o$1094, [P.keyset('a')]), o$1094);
});
test('pick renamed property into object', function (t$1112) {
    t$1112.plan(1);
    t$1112.deepEqual(P.pickObjToObj(o$1094, [P.rename(P.keyset('a'), 'b')]), { b: 1 });
});
test('pick missing mandatory property into object', function (t$1114) {
    t$1114.plan(1);
    t$1114.throws(function () {
        P.pickObjToObj(o$1094, [P.must(P.keyset('b'))]);
    });
});
test('pick must-not-exist property into object', function (t$1116) {
    t$1116.plan(1);
    t$1116.throws(function () {
        P.pickObjToObj(o$1094, [P.mustnot(P.keyset('a'))]);
    });
});
test('pick with default value', function (t$1118) {
    t$1118.plan(1);
    t$1118.deepEqual(P.pickObjToObj(o$1094, [P.deflt(P.keyset('b'), 42)]), { b: 42 });
});
test('pick properties from array of name', function (t$1120) {
    t$1120.plan(1);
    var props$1121 = ['a'];
    t$1120.deepEqual(P.pickObjToObj(o$1094, [P.keyset(props$1121)]), { a: 1 });
});
test('pick properties based on regexp', function (t$1123) {
    t$1123.plan(1);
    var regexp$1124 = /a/;
    t$1123.deepEqual(P.pickObjToObj(o$1094, [P.keyset(regexp$1124)]), { a: 1 });
});
test('pick properties based on object properties', function (t$1126) {
    t$1126.plan(1);
    var obj$1127 = { a: 1 };
    t$1126.deepEqual(P.pickObjToObj(o$1094, [P.keyset(obj$1127)]), { a: 1 });
});
test('invalid value* in picklist throws', function (t$1129) {
    t$1129.plan(1);
    var val$1130 = 22;
    t$1129.throws(function () {
        P.pickObjToObj(null, [P.keyset(val$1130)]);
    });
});
test('rest operator picks up all props', function (t$1132) {
    t$1132.plan(1);
    t$1132.deepEqual(P.pickObjToObj(o$1094, [
        P.keyset('a'),
        P.rest()
    ]), o$1094);
});
test('mandatory rest operator', function (t$1134) {
    t$1134.plan(1);
    t$1134.throws(function () {
        P.pickObjToObj(o$1094, [
            P.keyset('a'),
            P.must(P.rest())
        ]);
    });
});
test('pick assignment', function (t$1136) {
    t$1136.plan(1);
    var a$1137;
    a$1137 = P.pickObjToVal(o$1094, P.keyset('a'));
    t$1136.equal(a$1137, 1);
});
test('pick from non-object should throw if #?', function (t$1140) {
    t$1140.plan(1);
    t$1140.throws(function () {
        P.pickObjToObj(P.guard(0), [P.keyset('a')]);
    });
});
// PICK FROM OBJECT INTO ARRAY
test('pick from object into array', function (t$1142) {
    t$1142.plan(1);
    t$1142.deepEqual(P.pickObjToArr(o$1094, [P.keyset('a')]), [1]);
});
test('pick rest from object into array', function (t$1144) {
    t$1144.plan(1);
    t$1144.equal(P.pickObjToArr(o$1094, [P.rest()]).length, 1);
});
test('pick from object into array with rename', function (t$1146) {
    t$1146.plan(1);
    // This will create an array of the form `[undefined, 1]`.
    t$1146.equal(P.pickObjToArr(o$1094, [P.rename(P.keyset('a'), 1)]).length, 2);
});
test('renaming function: uppercase property names', function (t$1148) {
    t$1148.plan(1);
    t$1148.deepEqual(P.pickObjToObj(o$1094, [P.rename(P.rest(), p$1150 => p$1150.toUpperCase())]), { A: 1 });
});
// PICK FROM ARRAY INTO VALUE
// PICK FROM ARRAY INTO ARRAY
test('pick from array into array', function (t$1151) {
    t$1151.plan(1);
    // This will create an array of the form `[undefined, 1]`.
    t$1151.deepEqual(P.pickArrToArr([
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
test('pick from array into array using negative index', function (t$1153) {
    t$1153.plan(1);
    t$1153.deepEqual(P.pickArrToArr([
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
test('pick from array into array using range', function (t$1155) {
    t$1155.plan(1);
    t$1155.deepEqual(P.pickArrToArr([
        1,
        2
    ], [P.pickRange(0, 1)]), [
        1,
        2
    ]);
});
test('reverse array', function (t$1157) {
    t$1157.plan(1);
    t$1157.deepEqual(P.pickArrToArr([
        1,
        2,
        3
    ], [P.pickRange(-1, 0)]), [
        3,
        2,
        1
    ]);
});
