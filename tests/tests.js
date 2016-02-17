import * as P from '..';
import { test } from 'tape';
var o$1091 = { a: 1 };
var VALUE_TESTS$1092 = true;
var OBJECT_TESTS$1093 = true;
// DEEP PICK
test('deep pick', function (t$1094) {
    t$1094.plan(2);
    t$1094.deepEqual(P.object(P.pick([P.deep(P.key('a'), P.pick([P.key('b')]))]))({ a: { b: 1 } }), { b: 1 });
    t$1094.deepEqual(P.object(P.pick([P.deep(P.key('a'), P.pick([P.deep(P.key('b'), P.pick([P.key('c')]))]))]))({ a: { b: { c: 1 } } }), { c: 1 });
});
// PICKING INTO VALUES
test('pick named property as value', { skip: !VALUE_TESTS$1092 }, function (t$1172) {
    t$1172.plan(2);
    t$1172.equal(P.value(P.pick([P.key('a')]))(o$1091), 1);
    t$1172.equal(P.value(P.pick([P.key('a')]))(o$1091), 1);
});
test('pick missing property as value (yields undefined)', { skip: !VALUE_TESTS$1092 }, function (t$1178) {
    t$1178.plan(1);
    t$1178.equal(P.value(P.pick([P.key('b')]))({}), undefined);
});
//test.skip('retrieve nested property', function(t) {
// //   t.plan(1);
// //   t.equal(a # b # {b: o}, 1);
// // });
test('pick named property as value', { skip: !VALUE_TESTS$1092 }, function (t$1182) {
    t$1182.plan(1);
    var prop$1184 = 'a';
    t$1182.equal(P.value(P.pick([P.key(prop$1184)]))(o$1091), 1);
});
test('pick mandatory missing property into value (throws)', { skip: !VALUE_TESTS$1092 }, function (t$1187) {
    t$1187.plan(2);
    t$1187.throws(function () {
        P.value(P.pick([P.must(P.key('b'))]))(o$1091);
    });
    t$1187.throws(function () {
        P.value(P.pick([P.must(P.key('b'))]))(null);
    });
});
test('pick missing property into value with default', { skip: !VALUE_TESTS$1092 }, function (t$1193) {
    t$1193.plan(1);
    t$1193.equal(P.value(P.pick([P.deflt(P.key('b'), 22)]))(o$1091), 22);
});
test('pick into value using pick function', { skip: !VALUE_TESTS$1092 }, function (t$1197) {
    t$1197.plan(2);
    var pickfunc$1200 = P.value(P.pick([P.key('a')]));
    t$1197.equal(typeof pickfunc$1200, 'function');
    t$1197.equal(pickfunc$1200(o$1091), 1);
});
// PICKING INTO OBJECTS
//test('renaming function: uppercase property names', function(t) {
//  t.plan(1);
//  // TODO: figure out why double parentheses are needed here.
//  t.deepEqual(o.{... -> ((p => p.toUpperCase()))}, {A: 1});
//});
test('pick property into object', function (t$1203) {
    t$1203.plan(1);
    t$1203.deepEqual(P.object(P.pick([P.key('a')]))(o$1091), o$1091);
});
test('pick renamed property into object', function (t$1207) {
    t$1207.plan(1);
    t$1207.deepEqual(P.object(P.pick([P.rename(P.key('a'), 'b')]))(o$1091), { b: 1 });
});
test('pick missing mandatory property into object (throws)', function (t$1211) {
    t$1211.plan(1);
    t$1211.throws(function () {
        P.object(P.pick([P.must(P.key('b'))]))(o$1091);
    });
});
test('pick must-not-exist property into object (throws)', function (t$1215) {
    t$1215.plan(1);
    t$1215.throws(function () {
        P.object(P.pick([P.mustnot(P.key('a'))]))(o$1091);
    });
});
test('pick into object with default value', function (t$1219) {
    t$1219.plan(1);
    t$1219.deepEqual(P.object(P.pick([P.deflt(P.key('b'), 42)]))(o$1091), { b: 42 });
});
test('pick properties from array of name into object', function (t$1223) {
    t$1223.plan(1);
    var props$1225 = ['a'];
    t$1223.deepEqual(P.object(P.pick([P.key(props$1225)]))(o$1091), { a: 1 });
});
test('pick properties based on regexp', function (t$1228) {
    t$1228.plan(1);
    var regexp$1230 = /a/;
    t$1228.deepEqual(P.object(P.pick([P.key(regexp$1230)]))(o$1091), { a: 1 });
});
test('pick properties based on object properties', function (t$1233) {
    t$1233.plan(1);
    var obj$1235 = { a: 1 };
    t$1233.deepEqual(P.object(P.pick([P.key(obj$1235)]))(o$1091), { a: 1 });
});
//test.skip('invalid value* in picklist throws', function(t) {
//   t.plan(1);
//   var val = 22;
//   t.throws(function() { {(val)}. null; });
// });
test('rest operator picks up all props', function (t$1238) {
    t$1238.plan(1);
    t$1238.deepEqual(P.object(P.pick([
        P.key('a'),
        P.rest()
    ]))(o$1091), o$1091);
});
test('mandatory rest with no remaining properties (throws)', function (t$1242) {
    t$1242.plan(1);
    t$1242.throws(function () {
        P.object(P.pick([
            P.key('a'),
            P.must(P.rest())
        ]))(o$1091);
    });
});
test('pick from non-object should throw if #?', function (t$1246) {
    t$1246.plan(1);
    t$1246.throws(function () {
        P.object(P.pick([P.key('a')]))(P.guard(null));
    });
});
// // PICK INTO ARRAY
test('pick from property into array', function (t$1250) {
    t$1250.plan(1);
    t$1250.deepEqual(P.array(P.pick([P.key('a')]))(o$1091), [1]);
});
test('pick rest from object into array', function (t$1254) {
    t$1254.plan(1);
    t$1254.equal(P.array(P.pick([P.rest()]))(o$1091).length, 1);
});
test('pick from object into array with rename', function (t$1259) {
    t$1259.plan(1);
    // This will create an array of the form `[undefined, 1]`.
    t$1259.equal(P.array(P.pick([P.rename(P.key('a'), 1)]))(o$1091).length, 2);
});
// PICK FROM ARRAY INTO ARRAY
test('swap array elements', function (t$1264) {
    t$1264.plan(1);
    // This will create an array of the form `[undefined, 1]`.
    t$1264.deepEqual(P.array(P.pick([
        P.key(1),
        P.key(0)
    ]))([
        1,
        2
    ]), [
        2,
        1
    ]);
});
test('pick from array into array using negative index', function (t$1268) {
    t$1268.plan(1);
    t$1268.deepEqual(P.array(P.pick([
        P.key(-1),
        P.key(-2)
    ]))([
        1,
        2
    ]), [
        2,
        1
    ]);
});
test('pick from array into array using range', function (t$1272) {
    t$1272.plan(1);
    t$1272.deepEqual(P.array(P.pick([P.range(0, 1)]))([
        1,
        2
    ]), [
        1,
        2
    ]);
});
test('reverse array', function (t$1276) {
    t$1276.plan(1);
    t$1276.deepEqual(P.array(P.pick([P.range(-1, 0)]))([
        1,
        2,
        3
    ]), [
        3,
        2,
        1
    ]);
});
test('initialize array', function (t$1280) {
    t$1280.plan(1);
    t$1280.deepEqual(P.array(P.pick([P.deflt(P.range(0, 2), x$1284 => x$1284 * x$1284, true)]))([]), [
        0,
        1,
        4
    ]);
});
test('tail of array by omitting first element', function (t$1285) {
    t$1285.plan(1);
    t$1285.deepEqual(P.array(P.pick([
        P.omit(P.key(0)),
        P.rest()
    ]))([
        1,
        2
    ]), [2]);
});
test('splice array', function (t$1289) {
    t$1289.plan(1);
    t$1289.deepEqual(P.array(P.pick([
        P.omit(P.range(1, 2)),
        P.rest()
    ]))([
        1,
        2,
        3,
        4
    ]), [
        1,
        4
    ]);
});
// When the property picked is a function, we must adjust the `this`
// in order to allow it to be called properly.
test('this handling', function (t$1293) {
    t$1293.plan(1);
    var o$1295 = {
        v: 42,
        f: function () {
            return this.v;
        }
    };
    var picker$1297 = P.value(P.pick([P.key('f')]));
    t$1293.equal(picker$1297(o$1295)(), 42);
});
