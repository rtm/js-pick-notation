import * as P from '..';
import { test } from 'tape';
var o$1091 = { a: 1 };
var VALUE_TESTS$1092 = true;
var OBJECT_TESTS$1093 = true;
// DEEP PICK
test.only('deep pick', function (t$1095) {
    t$1095.plan(1);
    t$1095.deepEqual(P.object(P.pick([P.deep(P.key('a'), P.pick([P.key('b')]))]))({ a: { b: 1 } }), { b: 1 });
});
// PICKING INTO VALUES
test('pick named property as value', { skip: !VALUE_TESTS$1092 }, function (t$1117) {
    t$1117.plan(2);
    t$1117.equal(P.value(P.pick([P.key('a')]))(o$1091), 1);
    t$1117.equal(P.value(P.pick([P.key('a')]))(o$1091), 1);
});
test('pick missing property as value (yields undefined)', { skip: !VALUE_TESTS$1092 }, function (t$1123) {
    t$1123.plan(1);
    t$1123.equal(P.value(P.pick([P.key('b')]))({}), undefined);
});
//test.skip('retrieve nested property', function(t) {
// //   t.plan(1);
// //   t.equal(a # b # {b: o}, 1);
// // });
test('pick named property as value', { skip: !VALUE_TESTS$1092 }, function (t$1127) {
    t$1127.plan(1);
    var prop$1129 = 'a';
    t$1127.equal(P.value(P.pick([P.key(prop$1129)]))(o$1091), 1);
});
test('pick mandatory missing property into value (throws)', { skip: !VALUE_TESTS$1092 }, function (t$1132) {
    t$1132.plan(2);
    t$1132.throws(function () {
        P.value(P.pick([P.must(P.key('b'))]))(o$1091);
    });
    t$1132.throws(function () {
        P.value(P.pick([P.must(P.key('b'))]))(null);
    });
});
test('pick missing property into value with default', { skip: !VALUE_TESTS$1092 }, function (t$1138) {
    t$1138.plan(1);
    t$1138.equal(P.value(P.pick([P.deflt(P.key('b'), 22)]))(o$1091), 22);
});
test('pick into value using pick function', { skip: !VALUE_TESTS$1092 }, function (t$1142) {
    t$1142.plan(2);
    var pickfunc$1145 = P.value(P.pick([P.key('a')]));
    t$1142.equal(typeof pickfunc$1145, 'function');
    t$1142.equal(pickfunc$1145(o$1091), 1);
});
// PICKING INTO OBJECTS
//test('renaming function: uppercase property names', function(t) {
//  t.plan(1);
//  // TODO: figure out why double parentheses are needed here.
//  t.deepEqual(o.{... -> ((p => p.toUpperCase()))}, {A: 1});
//});
test('pick property into object', function (t$1148) {
    t$1148.plan(1);
    t$1148.deepEqual(P.object(P.pick([P.key('a')]))(o$1091), o$1091);
});
test('pick renamed property into object', function (t$1152) {
    t$1152.plan(1);
    t$1152.deepEqual(P.object(P.pick([P.rename(P.key('a'), 'b')]))(o$1091), { b: 1 });
});
test('pick missing mandatory property into object (throws)', function (t$1156) {
    t$1156.plan(1);
    t$1156.throws(function () {
        P.object(P.pick([P.must(P.key('b'))]))(o$1091);
    });
});
test('pick must-not-exist property into object (throws)', function (t$1160) {
    t$1160.plan(1);
    t$1160.throws(function () {
        P.object(P.pick([P.mustnot(P.key('a'))]))(o$1091);
    });
});
test('pick into object with default value', function (t$1164) {
    t$1164.plan(1);
    t$1164.deepEqual(P.object(P.pick([P.deflt(P.key('b'), 42)]))(o$1091), { b: 42 });
});
test('pick properties from array of name into object', function (t$1168) {
    t$1168.plan(1);
    var props$1170 = ['a'];
    t$1168.deepEqual(P.object(P.pick([P.key(props$1170)]))(o$1091), { a: 1 });
});
test('pick properties based on regexp', function (t$1173) {
    t$1173.plan(1);
    var regexp$1175 = /a/;
    t$1173.deepEqual(P.object(P.pick([P.key(regexp$1175)]))(o$1091), { a: 1 });
});
test('pick properties based on object properties', function (t$1178) {
    t$1178.plan(1);
    var obj$1180 = { a: 1 };
    t$1178.deepEqual(P.object(P.pick([P.key(obj$1180)]))(o$1091), { a: 1 });
});
//test.skip('invalid value* in picklist throws', function(t) {
//   t.plan(1);
//   var val = 22;
//   t.throws(function() { {(val)}. null; });
// });
test('rest operator picks up all props', function (t$1183) {
    t$1183.plan(1);
    t$1183.deepEqual(P.object(P.pick([
        P.key('a'),
        P.rest()
    ]))(o$1091), o$1091);
});
test('mandatory rest with no remaining properties (throws)', function (t$1187) {
    t$1187.plan(1);
    t$1187.throws(function () {
        P.object(P.pick([
            P.key('a'),
            P.must(P.rest())
        ]))(o$1091);
    });
});
test('pick from non-object should throw if #?', function (t$1191) {
    t$1191.plan(1);
    t$1191.throws(function () {
        P.object(P.pick([P.key('a')]))(P.guard(null));
    });
});
// // PICK INTO ARRAY
test('pick from property into array', function (t$1195) {
    t$1195.plan(1);
    t$1195.deepEqual(P.array(P.pick([P.key('a')]))(o$1091), [1]);
});
test('pick rest from object into array', function (t$1199) {
    t$1199.plan(1);
    t$1199.equal(P.array(P.pick([P.rest()]))(o$1091).length, 1);
});
test('pick from object into array with rename', function (t$1204) {
    t$1204.plan(1);
    // This will create an array of the form `[undefined, 1]`.
    t$1204.equal(P.array(P.pick([P.rename(P.key('a'), 1)]))(o$1091).length, 2);
});
// PICK FROM ARRAY INTO ARRAY
test('swap array elements', function (t$1209) {
    t$1209.plan(1);
    // This will create an array of the form `[undefined, 1]`.
    t$1209.deepEqual(P.array(P.pick([
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
test('pick from array into array using negative index', function (t$1213) {
    t$1213.plan(1);
    t$1213.deepEqual(P.array(P.pick([
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
test('pick from array into array using range', function (t$1217) {
    t$1217.plan(1);
    t$1217.deepEqual(P.array(P.pick([P.range(0, 1)]))([
        1,
        2
    ]), [
        1,
        2
    ]);
});
test('reverse array', function (t$1221) {
    t$1221.plan(1);
    t$1221.deepEqual(P.array(P.pick([P.range(-1, 0)]))([
        1,
        2,
        3
    ]), [
        3,
        2,
        1
    ]);
});
test('initialize array', function (t$1225) {
    t$1225.plan(1);
    t$1225.deepEqual(P.array(P.pick([P.deflt(P.range(0, 2), x$1229 => x$1229 * x$1229, true)]))([]), [
        0,
        1,
        4
    ]);
});
test('tail of array by omitting first element', function (t$1230) {
    t$1230.plan(1);
    t$1230.deepEqual(P.array(P.pick([
        P.omit(P.key(0)),
        P.rest()
    ]))([
        1,
        2
    ]), [2]);
});
test('splice array', function (t$1234) {
    t$1234.plan(1);
    t$1234.deepEqual(P.array(P.pick([
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
test('this handling', function (t$1238) {
    t$1238.plan(1);
    var o$1240 = {
        v: 42,
        f: function () {
            return this.v;
        }
    };
    var picker$1242 = P.value(P.pick([P.key('f')]));
    t$1238.equal(picker$1242(o$1240)(), 42);
});
