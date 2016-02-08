import * as P from '..';
import { test } from 'tape';
var o$1105 = { a: 1 };
// PICKING INTO VALUES
test('retrieve named property as value', function (t$1106) {
    t$1106.plan(2);
    t$1106.equal(P.pickObjToVal(o$1105, P.pick1('a')), 1);
    t$1106.equal(P.pickObjToVal(o$1105, P.pick1('a')), 1);
});
test('missing property yields undefined', function (t$1109) {
    t$1109.plan(1);
    t$1109.equal(P.pickObjToVal({}, P.pick1('b')), undefined);
});
test('retrieve nested property', function (t$1111) {
    t$1111.plan(1);
    t$1111.equal(P.pickObjToVal(P.pickObjToVal({ b: o$1105 }, P.pick1('b')), P.pick1('a')), 1);
});
test('retrieve property with computed name', function (t$1114) {
    t$1114.plan(1);
    var prop$1115 = 'a';
    t$1114.equal(P.pickObjToVal(o$1105, P.pick1(prop$1115)), 1);
});
test('throw when retrieving mandatory property which does not exist', function (t$1117) {
    t$1117.plan(2);
    t$1117.throws(function () {
        P.pickObjToVal(o$1105, P.mandatory(P.pick1('b')));
    });
    t$1117.throws(function () {
        P.pickObjToVal(0, P.mandatory(P.pick1('b')));
    });
});
// PICKING INTO OBJECTS
test('pick property into object', function (t$1120) {
    t$1120.plan(1);
    t$1120.deepEqual(P.pickObjToObj(o$1105, [P.pick1('a')]), o$1105);
});
test('pick renamed property into object', function (t$1122) {
    t$1122.plan(1);
    t$1122.deepEqual(P.pickObjToObj(o$1105, [P.rename(P.pick1('a'), 'b')]), { b: 1 });
});
test('pick missing mandatory property into object', function (t$1124) {
    t$1124.plan(1);
    t$1124.throws(function () {
        P.pickObjToObj(o$1105, [P.mandatory(P.pick1('b'))]);
    });
});
test('pick must-not-exist property into object', function (t$1126) {
    t$1126.plan(1);
    t$1126.throws(function () {
        P.pickObjToObj(o$1105, [P.notexist(P.pick1('a'))]);
    });
});
test('pick with default value', function (t$1128) {
    t$1128.plan(1);
    t$1128.deepEqual(P.pickObjToObj(o$1105, [P.deflt(P.pick1('b'), 42)]), { b: 42 });
});
test('pick properties from array of name', function (t$1130) {
    t$1130.plan(1);
    var props$1131 = ['a'];
    t$1130.deepEqual(P.pickObjToObj(o$1105, [P.pick1(props$1131)]), { a: 1 });
});
test('pick properties based on regexp', function (t$1133) {
    t$1133.plan(1);
    var regexp$1134 = /a/;
    t$1133.deepEqual(P.pickObjToObj(o$1105, [P.pick1(regexp$1134)]), { a: 1 });
});
test('pick properties based on object properties', function (t$1136) {
    t$1136.plan(1);
    var obj$1137 = { a: 1 };
    t$1136.deepEqual(P.pickObjToObj(o$1105, [P.pick1(obj$1137)]), { a: 1 });
});
test('invalid value* in picklist throws', function (t$1139) {
    t$1139.plan(1);
    var val$1140 = 22;
    t$1139.throws(function () {
        P.pickObjToObj(null, [P.pick1(val$1140)]);
    });
});
test('rest operator picks up all props', function (t$1142) {
    t$1142.plan(1);
    t$1142.deepEqual(P.pickObjToObj(o$1105, [
        P.pick1('a'),
        P.rest()
    ]), o$1105);
});
test('mandatory rest operator', function (t$1144) {
    t$1144.plan(1);
    t$1144.throws(function () {
        P.pickObjToObj(o$1105, [
            P.pick1('a'),
            P.mandatory(P.rest())
        ]);
    });
});
test('pick assignment', function (t$1146) {
    t$1146.plan(1);
    var a$1147;
    a$1147 = P.pickObjToVal(o$1105, P.pick1('a'));
    t$1146.equal(a$1147, 1);
});
test('pick from non-object should throw if #?', function (t$1150) {
    t$1150.plan(1);
    t$1150.throws(function () {
        P.pickObjToObj(P.check(0), [P.pick1('a')]);
    });
});
// PICK FROM OBJECT INTO ARRAY
test('pick from object into array', function (t$1152) {
    t$1152.plan(1);
    t$1152.deepEqual(P.pickObjToArr(o$1105, [P.pick1('a')]), [1]);
});
test('pick rest from object into array', function (t$1154) {
    t$1154.plan(1);
    t$1154.equal(P.pickObjToArr(o$1105, [P.rest()]).length, 1);
});
test('pick from object into array with rename', function (t$1156) {
    t$1156.plan(1);
    // This will create an array of the form `[undefined, 1]`.
    t$1156.equal(P.pickObjToArr(o$1105, [P.rename(P.pick1('a'), 1)]).length, 2);
});
// PICK FROM ARRAY INTO VALUE
// PICK FROM ARRAY INTO ARRAY
test('pick from array into array', function (t$1158) {
    t$1158.plan(1);
    // This will create an array of the form `[undefined, 1]`.
    t$1158.deepEqual(P.pickArrToArr([
        1,
        2
    ], [
        P.pick1(1),
        P.pick1(0)
    ]), [
        2,
        1
    ]);
});
test('pick from array into array using negative index', function (t$1160) {
    t$1160.plan(1);
    t$1160.deepEqual(P.pickArrToArr([
        1,
        2
    ], [
        P.pick1(-1),
        P.pick1(-2)
    ]), [
        2,
        1
    ]);
});
test('pick from array into array using range', function (t$1162) {
    t$1162.plan(1);
    t$1162.deepEqual(P.pickArrToArr([
        1,
        2
    ], [P.pickRange(0, 1)]), [
        1,
        2
    ]);
});
test('reverse array', function (t$1164) {
    t$1164.plan(1);
    t$1164.deepEqual(P.pickArrToArr([
        1,
        2,
        3
    ], [P.pickRange(-1, 0)]), [
        3,
        2,
        1
    ]);
});
