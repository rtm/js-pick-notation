import * as P from '..';
import { test } from 'tape';
var o$1053 = { a: 1 };
var VALUE_TESTS$1054 = true;
var OBJECT_TESTS$1055 = true;
// PICKING INTO VALUES
test('pick named property as value', { skip: !VALUE_TESTS$1054 }, function (t$1056) {
    P.value(P.pick([P.key('plan')]))(t$1056)(2);
    P.value(P.pick([P.key('equal')]))(t$1056)(P.value(P.pick([P.key('a')]))(o$1053), 1);
    P.value(P.pick([P.key('equal')]))(t$1056)(P.value(P.pick([P.key('a')]))(o$1053), 1);
});
test('pick missing property as value (yields undefined)', { skip: !VALUE_TESTS$1054 }, function (t$1098) {
    P.value(P.pick([P.key('plan')]))(t$1098)(1);
    P.value(P.pick([P.key('equal')]))(t$1098)(P.value(P.pick([P.key('b')]))({}), undefined);
});
//test.skip('retrieve nested property', function(t) {
// //   t.plan(1);
// //   t.equal(a # b # {b: o}, 1);
// // });
test('pick named property as value', { skip: !VALUE_TESTS$1054 }, function (t$1120) {
    P.value(P.pick([P.key('plan')]))(t$1120)(1);
    var prop$1122 = 'a';
    P.value(P.pick([P.key('equal')]))(t$1120)(P.value(P.pick([P.key(prop$1122)]))(o$1053), 1);
});
test('pick mandatory missing property into value (throws)', { skip: !VALUE_TESTS$1054 }, function (t$1143) {
    P.value(P.pick([P.key('plan')]))(t$1143)(2);
    P.value(P.pick([P.key('throws')]))(t$1143)(function () {
        P.value(P.pick([P.must(P.key('b'))]))(o$1053);
    });
    P.value(P.pick([P.key('throws')]))(t$1143)(function () {
        P.value(P.pick([P.must(P.key('b'))]))(null);
    });
});
test('pick missing property into value with default', { skip: !VALUE_TESTS$1054 }, function (t$1149) {
    P.value(P.pick([P.key('plan')]))(t$1149)(1);
    P.value(P.pick([P.key('equal')]))(t$1149)(P.value(P.pick([P.deflt(P.key('b'), 22)]))(o$1053), 22);
});
test('pick into value using pick function', { skip: !VALUE_TESTS$1054 }, function (t$1171) {
    P.value(P.pick([P.key('plan')]))(t$1171)(2);
    var pickfunc$1174 = P.value(P.pick([P.key('a')]));
    P.value(P.pick([P.key('equal')]))(t$1171)(typeof pickfunc$1174, 'function');
    P.value(P.pick([P.key('equal')]))(t$1171)(pickfunc$1174(o$1053), 1);
});
// PICKING INTO OBJECTS
//test('renaming function: uppercase property names', function(t) {
//  t.plan(1);
//  // TODO: figure out why double parentheses are needed here.
//  t.deepEqual(o.{... -> ((p => p.toUpperCase()))}, {A: 1});
//});
test('pick property into object', function (t$1177) {
    P.value(P.pick([P.key('plan')]))(t$1177)(1);
    P.value(P.pick([P.key('deepEqual')]))(t$1177)(P.object(P.pick([P.key('a')]))(o$1053), o$1053);
});
test('pick renamed property into object', function (t$1199) {
    P.value(P.pick([P.key('plan')]))(t$1199)(1);
    P.value(P.pick([P.key('deepEqual')]))(t$1199)(P.object(P.pick([P.rename(P.key('a'), 'b')]))(o$1053), { b: 1 });
});
test('pick missing mandatory property into object (throws)', function (t$1221) {
    P.value(P.pick([P.key('plan')]))(t$1221)(1);
    P.value(P.pick([P.key('throws')]))(t$1221)(function () {
        P.object(P.pick([P.must(P.key('b'))]))(o$1053);
    });
});
test('pick must-not-exist property into object (throws)', function (t$1225) {
    P.value(P.pick([P.key('plan')]))(t$1225)(1);
    P.value(P.pick([P.key('throws')]))(t$1225)(function () {
        P.object(P.pick([P.mustnot(P.key('a'))]))(o$1053);
    });
});
test('pick into object with default value', function (t$1229) {
    P.value(P.pick([P.key('plan')]))(t$1229)(1);
    P.value(P.pick([P.key('deepEqual')]))(t$1229)(P.object(P.pick([P.deflt(P.key('b'), 42)]))(o$1053), { b: 42 });
});
test('pick properties from array of name into object', function (t$1251) {
    P.value(P.pick([P.key('plan')]))(t$1251)(1);
    var props$1253 = ['a'];
    P.value(P.pick([P.key('deepEqual')]))(t$1251)(P.object(P.pick([P.key(props$1253)]))(o$1053), { a: 1 });
});
test('pick properties based on regexp', function (t$1274) {
    P.value(P.pick([P.key('plan')]))(t$1274)(1);
    var regexp$1276 = /a/;
    P.value(P.pick([P.key('deepEqual')]))(t$1274)(P.object(P.pick([P.key(regexp$1276)]))(o$1053), { a: 1 });
});
test('pick properties based on object properties', function (t$1297) {
    P.value(P.pick([P.key('plan')]))(t$1297)(1);
    var obj$1299 = { a: 1 };
    P.value(P.pick([P.key('deepEqual')]))(t$1297)(P.object(P.pick([P.key(obj$1299)]))(o$1053), { a: 1 });
});
//test.skip('invalid value* in picklist throws', function(t) {
//   t.plan(1);
//   var val = 22;
//   t.throws(function() { {(val)}. null; });
// });
test('rest operator picks up all props', function (t$1320) {
    P.value(P.pick([P.key('plan')]))(t$1320)(1);
    P.value(P.pick([P.key('deepEqual')]))(t$1320)(P.object(P.pick([
        P.key('a'),
        P.rest()
    ]))(o$1053), o$1053);
});
test('mandatory rest with no remaining properties (throws)', function (t$1342) {
    P.value(P.pick([P.key('plan')]))(t$1342)(1);
    P.value(P.pick([P.key('throws')]))(t$1342)(function () {
        P.object(P.pick([
            P.key('a'),
            P.must(P.rest())
        ]))(o$1053);
    });
});
test('pick from non-object should throw if #?', function (t$1346) {
    P.value(P.pick([P.key('plan')]))(t$1346)(1);
    P.value(P.pick([P.key('throws')]))(t$1346)(function () {
        P.object(P.pick([P.key('a')]))(P.guard(null));
    });
});
// // PICK INTO ARRAY
test('pick from property into array', function (t$1350) {
    P.value(P.pick([P.key('plan')]))(t$1350)(1);
    P.value(P.pick([P.key('deepEqual')]))(t$1350)(P.array(P.pick([P.key('a')]))(o$1053), [1]);
});
test('pick rest from object into array', function (t$1372) {
    P.value(P.pick([P.key('plan')]))(t$1372)(1);
    P.value(P.pick([P.key('equal')]))(t$1372)(P.value(P.pick([P.key('length')]))(P.array(P.pick([P.rest()]))(o$1053)), 1);
});
test('pick from object into array with rename', function (t$1413) {
    P.value(P.pick([P.key('plan')]))(t$1413)(1);
    P.value(P.pick([P.key('equal')]))(// This will create an array of the form `[undefined, 1]`.
    t$1413)(P.value(P.pick([P.key('length')]))(P.array(P.pick([P.rename(P.key('a'), 1)]))(o$1053)), 2);
});
// PICK FROM ARRAY INTO ARRAY
test('swap array elements', function (t$1454) {
    P.value(P.pick([P.key('plan')]))(t$1454)(1);
    P.value(P.pick([P.key('deepEqual')]))(// This will create an array of the form `[undefined, 1]`.
    t$1454)(P.array(P.pick([
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
test('pick from array into array using negative index', function (t$1476) {
    P.value(P.pick([P.key('plan')]))(t$1476)(1);
    P.value(P.pick([P.key('deepEqual')]))(t$1476)(P.array(P.pick([
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
test('pick from array into array using range', function (t$1498) {
    P.value(P.pick([P.key('plan')]))(t$1498)(1);
    P.value(P.pick([P.key('deepEqual')]))(t$1498)(P.array(P.pick([P.range(0, 1)]))([
        1,
        2
    ]), [
        1,
        2
    ]);
});
test('reverse array', function (t$1520) {
    P.value(P.pick([P.key('plan')]))(t$1520)(1);
    P.value(P.pick([P.key('deepEqual')]))(t$1520)(P.array(P.pick([P.range(-1, 0)]))([
        1,
        2,
        3
    ]), [
        3,
        2,
        1
    ]);
});
test('initialize array', function (t$1542) {
    P.value(P.pick([P.key('plan')]))(t$1542)(1);
    P.value(P.pick([P.key('deepEqual')]))(t$1542)(P.array(P.pick([P.deflt(P.range(0, 2), x$1564 => x$1564 * x$1564, true)]))([]), [
        0,
        1,
        4
    ]);
});
test('tail of array by omitting first element', function (t$1565) {
    P.value(P.pick([P.key('plan')]))(t$1565)(1);
    P.value(P.pick([P.key('deepEqual')]))(t$1565)(P.array(P.pick([
        P.omit(P.key(0)),
        P.rest()
    ]))([
        1,
        2
    ]), [2]);
});
test('splice array', function (t$1587) {
    P.value(P.pick([P.key('plan')]))(t$1587)(1);
    P.value(P.pick([P.key('deepEqual')]))(t$1587)(P.array(P.pick([
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
