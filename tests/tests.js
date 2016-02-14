import * as P from '..';
import { test } from 'tape';
var o$1058 = { a: 1 };
var VALUE_TESTS$1059 = true;
var OBJECT_TESTS$1060 = true;
// PICKING INTO VALUES
test('pick named property as value', { skip: !VALUE_TESTS$1059 }, function (t$1061) {
    t$1061.plan(2);
    t$1061.equal(P.value(P.pick([P.key('a')]))(o$1058), 1);
    t$1061.equal(P.value(P.pick([P.key('a')]))(o$1058), 1);
});
test('pick missing property as value (yields undefined)', { skip: !VALUE_TESTS$1059 }, function (t$1067) {
    t$1067.plan(1);
    t$1067.equal(P.value(P.pick([P.key('b')]))({}), undefined);
});
//test.skip('retrieve nested property', function(t) {
// //   t.plan(1);
// //   t.equal(a # b # {b: o}, 1);
// // });
test('pick named property as value', { skip: !VALUE_TESTS$1059 }, function (t$1071) {
    t$1071.plan(1);
    var prop$1073 = 'a';
    t$1071.equal(P.value(P.pick([P.key(prop$1073)]))(o$1058), 1);
});
test('pick mandatory missing property into value (throws)', { skip: !VALUE_TESTS$1059 }, function (t$1076) {
    t$1076.plan(2);
    t$1076.throws(function () {
        P.value(P.pick([P.must(P.key('b'))]))(o$1058);
    });
    t$1076.throws(function () {
        P.value(P.pick([P.must(P.key('b'))]))(null);
    });
});
test('pick missing property into value with default', { skip: !VALUE_TESTS$1059 }, function (t$1082) {
    t$1082.plan(1);
    t$1082.equal(P.value(P.pick([P.deflt(P.key('b'), 22)]))(o$1058), 22);
});
test('pick into value using pick function', { skip: !VALUE_TESTS$1059 }, function (t$1086) {
    t$1086.plan(2);
    var pickfunc$1089 = P.value(P.pick([P.key('a')]));
    t$1086.equal(typeof pickfunc$1089, 'function');
    t$1086.equal(pickfunc$1089(o$1058), 1);
});
// PICKING INTO OBJECTS
//test('renaming function: uppercase property names', function(t) {
//  t.plan(1);
//  // TODO: figure out why double parentheses are needed here.
//  t.deepEqual(o.{... -> ((p => p.toUpperCase()))}, {A: 1});
//});
test('pick property into object', function (t$1092) {
    t$1092.plan(1);
    t$1092.deepEqual(P.object(P.pick([P.key('a')]))(o$1058), o$1058);
});
test('pick renamed property into object', function (t$1096) {
    t$1096.plan(1);
    t$1096.deepEqual(P.object(P.pick([P.rename(P.key('a'), 'b')]))(o$1058), { b: 1 });
});
test('pick missing mandatory property into object (throws)', function (t$1100) {
    t$1100.plan(1);
    t$1100.throws(function () {
        P.object(P.pick([P.must(P.key('b'))]))(o$1058);
    });
});
test('pick must-not-exist property into object (throws)', function (t$1104) {
    t$1104.plan(1);
    t$1104.throws(function () {
        P.object(P.pick([P.mustnot(P.key('a'))]))(o$1058);
    });
});
test('pick into object with default value', function (t$1108) {
    t$1108.plan(1);
    t$1108.deepEqual(P.object(P.pick([P.deflt(P.key('b'), 42)]))(o$1058), { b: 42 });
});
test('pick properties from array of name into object', function (t$1112) {
    t$1112.plan(1);
    var props$1114 = ['a'];
    t$1112.deepEqual(P.object(P.pick([P.key(props$1114)]))(o$1058), { a: 1 });
});
test('pick properties based on regexp', function (t$1117) {
    t$1117.plan(1);
    var regexp$1119 = /a/;
    t$1117.deepEqual(P.object(P.pick([P.key(regexp$1119)]))(o$1058), { a: 1 });
});
test('pick properties based on object properties', function (t$1122) {
    t$1122.plan(1);
    var obj$1124 = { a: 1 };
    t$1122.deepEqual(P.object(P.pick([P.key(obj$1124)]))(o$1058), { a: 1 });
});
//test.skip('invalid value* in picklist throws', function(t) {
//   t.plan(1);
//   var val = 22;
//   t.throws(function() { {(val)}. null; });
// });
test('rest operator picks up all props', function (t$1127) {
    t$1127.plan(1);
    t$1127.deepEqual(P.object(P.pick([
        P.key('a'),
        P.rest()
    ]))(o$1058), o$1058);
});
test('mandatory rest with no remaining properties (throws)', function (t$1131) {
    t$1131.plan(1);
    t$1131.throws(function () {
        P.object(P.pick([
            P.key('a'),
            P.must(P.rest())
        ]))(o$1058);
    });
});
test('pick from non-object should throw if #?', function (t$1135) {
    t$1135.plan(1);
    t$1135.throws(function () {
        P.object(P.pick([P.key('a')]))(P.guard(null));
    });
});
// // PICK INTO ARRAY
test('pick from property into array', function (t$1139) {
    t$1139.plan(1);
    t$1139.deepEqual(P.array(P.pick([P.key('a')]))(o$1058), [1]);
});
test('pick rest from object into array', function (t$1143) {
    t$1143.plan(1);
    t$1143.equal(P.array(P.pick([P.rest()]))(o$1058).length, 1);
});
test('pick from object into array with rename', function (t$1148) {
    t$1148.plan(1);
    // This will create an array of the form `[undefined, 1]`.
    t$1148.equal(P.array(P.pick([P.rename(P.key('a'), 1)]))(o$1058).length, 2);
});
// PICK FROM ARRAY INTO ARRAY
test('swap array elements', function (t$1153) {
    t$1153.plan(1);
    // This will create an array of the form `[undefined, 1]`.
    t$1153.deepEqual(P.array(P.pick([
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
test('pick from array into array using negative index', function (t$1157) {
    t$1157.plan(1);
    t$1157.deepEqual(P.array(P.pick([
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
test('pick from array into array using range', function (t$1161) {
    t$1161.plan(1);
    t$1161.deepEqual(P.array(P.pick([P.range(0, 1)]))([
        1,
        2
    ]), [
        1,
        2
    ]);
});
test('reverse array', function (t$1165) {
    t$1165.plan(1);
    t$1165.deepEqual(P.array(P.pick([P.range(-1, 0)]))([
        1,
        2,
        3
    ]), [
        3,
        2,
        1
    ]);
});
test('initialize array', function (t$1169) {
    t$1169.plan(1);
    t$1169.deepEqual(P.array(P.pick([P.deflt(P.range(0, 2), x$1173 => x$1173 * x$1173, true)]))([]), [
        0,
        1,
        4
    ]);
});
test('tail of array by omitting first element', function (t$1174) {
    t$1174.plan(1);
    t$1174.deepEqual(P.array(P.pick([
        P.omit(P.key(0)),
        P.rest()
    ]))([
        1,
        2
    ]), [2]);
});
test('splice array', function (t$1178) {
    t$1178.plan(1);
    t$1178.deepEqual(P.array(P.pick([
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
test('this handling', function (t$1182) {
    t$1182.plan(1);
    var o$1184 = {
        v: 42,
        f: function () {
            console.log('this is', this);
            return this.v;
        }
    };
    var picker$1186 = P.value(P.pick([P.key('f')]));
    console.log('picker is', picker$1186(o$1184));
    t$1182.equal(picker$1186(o$1184)(), 42);
});
