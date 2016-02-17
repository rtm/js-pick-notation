import * as P from '..';
import { test } from 'tape';
var o$1073 = { a: 1 };
var VALUE_TESTS$1074 = true;
var OBJECT_TESTS$1075 = true;
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
test('pick named property as value', { skip: !VALUE_TESTS$1074 }, function (t$1076) {
    t$1076.plan(2);
    t$1076.equal(P.value(P.pick([P.key('a')]))(o$1073), 1);
    t$1076.equal(P.value(P.pick([P.key('a')]))(o$1073), 1);
});
test('pick missing property as value (yields undefined)', { skip: !VALUE_TESTS$1074 }, function (t$1082) {
    t$1082.plan(1);
    t$1082.equal(P.value(P.pick([P.key('b')]))({}), undefined);
});
//test.skip('retrieve nested property', function(t) {
// //   t.plan(1);
// //   t.equal(a # b # {b: o}, 1);
// // });
test('pick named property as value', { skip: !VALUE_TESTS$1074 }, function (t$1086) {
    t$1086.plan(1);
    var prop$1088 = 'a';
    t$1086.equal(P.value(P.pick([P.key(prop$1088)]))(o$1073), 1);
});
test('pick mandatory missing property into value (throws)', { skip: !VALUE_TESTS$1074 }, function (t$1091) {
    t$1091.plan(2);
    t$1091.throws(function () {
        P.value(P.pick([P.must(P.key('b'))]))(o$1073);
    });
    t$1091.throws(function () {
        P.value(P.pick([P.must(P.key('b'))]))(null);
    });
});
test('pick missing property into value with default', { skip: !VALUE_TESTS$1074 }, function (t$1097) {
    t$1097.plan(1);
    t$1097.equal(P.value(P.pick([P.deflt(P.key('b'), 22)]))(o$1073), 22);
});
test('pick into value using pick function', { skip: !VALUE_TESTS$1074 }, function (t$1101) {
    t$1101.plan(2);
    var pickfunc$1104 = P.value(P.pick([P.key('a')]));
    t$1101.equal(typeof pickfunc$1104, 'function');
    t$1101.equal(pickfunc$1104(o$1073), 1);
});
// PICKING INTO OBJECTS
//test('renaming function: uppercase property names', function(t) {
//  t.plan(1);
//  // TODO: figure out why double parentheses are needed here.
//  t.deepEqual(o.{... -> ((p => p.toUpperCase()))}, {A: 1});
//});
test('pick property into object', function (t$1107) {
    t$1107.plan(1);
    t$1107.deepEqual(P.object(P.pick([P.key('a')]))(o$1073), o$1073);
});
test('pick renamed property into object', function (t$1111) {
    t$1111.plan(1);
    t$1111.deepEqual(P.object(P.pick([P.rename(P.key('a'), 'b')]))(o$1073), { b: 1 });
});
test('pick missing mandatory property into object (throws)', function (t$1115) {
    t$1115.plan(1);
    t$1115.throws(function () {
        P.object(P.pick([P.must(P.key('b'))]))(o$1073);
    });
});
test('pick must-not-exist property into object (throws)', function (t$1119) {
    t$1119.plan(1);
    t$1119.throws(function () {
        P.object(P.pick([P.mustnot(P.key('a'))]))(o$1073);
    });
});
test('pick into object with default value', function (t$1123) {
    t$1123.plan(1);
    t$1123.deepEqual(P.object(P.pick([P.deflt(P.key('b'), 42)]))(o$1073), { b: 42 });
});
test('pick properties from array of name into object', function (t$1127) {
    t$1127.plan(1);
    var props$1129 = ['a'];
    t$1127.deepEqual(P.object(P.pick([P.key(props$1129)]))(o$1073), { a: 1 });
});
test('pick properties based on regexp', function (t$1132) {
    t$1132.plan(1);
    var regexp$1134 = /a/;
    t$1132.deepEqual(P.object(P.pick([P.key(regexp$1134)]))(o$1073), { a: 1 });
});
test('pick properties based on object properties', function (t$1137) {
    t$1137.plan(1);
    var obj$1139 = { a: 1 };
    t$1137.deepEqual(P.object(P.pick([P.key(obj$1139)]))(o$1073), { a: 1 });
});
//test.skip('invalid value* in picklist throws', function(t) {
//   t.plan(1);
//   var val = 22;
//   t.throws(function() { {(val)}. null; });
// });
test('rest operator picks up all props', function (t$1142) {
    t$1142.plan(1);
    t$1142.deepEqual(P.object(P.pick([
        P.key('a'),
        P.rest()
    ]))(o$1073), o$1073);
});
test('mandatory rest with no remaining properties (throws)', function (t$1146) {
    t$1146.plan(1);
    t$1146.throws(function () {
        P.object(P.pick([
            P.key('a'),
            P.must(P.rest())
        ]))(o$1073);
    });
});
test('pick from non-object should throw if #?', function (t$1150) {
    t$1150.plan(1);
    t$1150.throws(function () {
        P.object(P.pick([P.key('a')]))(P.guard(null));
    });
});
// // PICK INTO ARRAY
test('pick from property into array', function (t$1154) {
    t$1154.plan(1);
    t$1154.deepEqual(P.array(P.pick([P.key('a')]))(o$1073), [1]);
});
test('pick rest from object into array', function (t$1158) {
    t$1158.plan(1);
    t$1158.equal(P.array(P.pick([P.rest()]))(o$1073).length, 1);
});
test('pick from object into array with rename', function (t$1163) {
    t$1163.plan(1);
    // This will create an array of the form `[undefined, 1]`.
    t$1163.equal(P.array(P.pick([P.rename(P.key('a'), 1)]))(o$1073).length, 2);
});
// PICK FROM ARRAY INTO ARRAY
test('swap array elements', function (t$1168) {
    t$1168.plan(1);
    // This will create an array of the form `[undefined, 1]`.
    t$1168.deepEqual(P.array(P.pick([
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
test('pick from array into array using negative index', function (t$1172) {
    t$1172.plan(1);
    t$1172.deepEqual(P.array(P.pick([
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
test('pick from array into array using range', function (t$1176) {
    t$1176.plan(1);
    t$1176.deepEqual(P.array(P.pick([P.range(0, 1)]))([
        1,
        2
    ]), [
        1,
        2
    ]);
});
test('reverse array', function (t$1180) {
    t$1180.plan(1);
    t$1180.deepEqual(P.array(P.pick([P.range(-1, 0)]))([
        1,
        2,
        3
    ]), [
        3,
        2,
        1
    ]);
});
test('initialize array', function (t$1184) {
    t$1184.plan(1);
    t$1184.deepEqual(P.array(P.pick([P.deflt(P.range(0, 2), x$1188 => x$1188 * x$1188, true)]))([]), [
        0,
        1,
        4
    ]);
});
test('tail of array by omitting first element', function (t$1189) {
    t$1189.plan(1);
    t$1189.deepEqual(P.array(P.pick([
        P.omit(P.key(0)),
        P.rest()
    ]))([
        1,
        2
    ]), [2]);
});
test('splice array', function (t$1193) {
    t$1193.plan(1);
    t$1193.deepEqual(P.array(P.pick([
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
test('this handling', function (t$1197) {
    t$1197.plan(1);
    var o$1199 = {
        v: 42,
        f: function () {
            return this.v;
        }
    };
    var picker$1201 = P.value(P.pick([P.key('f')]));
    t$1197.equal(picker$1201(o$1199)(), 42);
});
// NESTED PICKS
//test.only('nested pick', function(t) {
//  t.plan(1);
//  t.deepEqual(
//    {a: {b: 1}}.{a:{b}},
//    {b: 1}
//  );
//});
// Pick funcs
test('pickfuncs as pickelts', function (t$1204) {
    var o$1205 = {
        a: 1,
        b: 2
    };
    t$1204.plan(3);
    t$1204.deepEqual(P.object(P.pick([P.key(P.value(P.pick([P.key('a')])))]))(o$1205), { a: 1 });
    t$1204.deepEqual(P.object(P.pick([
        P.key(P.value(P.pick([P.key('a')]))),
        P.key(P.value(P.pick([P.key('b')])))
    ]))(o$1205), o$1205);
    t$1204.deepEqual(P.object(P.pick([
        P.key(P.value(P.pick([P.key('a')]))),
        P.key(P.value(P.pick([P.rest()])))
    ]))(o$1205), o$1205, 'rest as function');
});
test('pickfunc from array of objects', function (t$1453) {
    t$1453.plan(1);
    var o$1455 = [
        { a: 1 },
        { a: 2 }
    ];
    t$1453.deepEqual(o$1455.map(P.value(P.pick([P.key('a')]))), [
        1,
        2
    ]);
});
