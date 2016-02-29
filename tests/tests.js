import * as P from '..';
import { test } from 'tape';
var o$1052 = { a: 1 };
var VALUE_TESTS$1053 = true;
var OBJECT_TESTS$1054 = true;
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
test('pick named property as value', { skip: !VALUE_TESTS$1053 }, function (t$1055) {
    t$1055.plan(2);
    t$1055.equal(P.value(P.pick([P.key('a')]))(o$1052), 1);
    t$1055.equal(P.value(P.pick([P.key('a')]))(o$1052), 1);
});
test('pick missing property as value (yields undefined)', { skip: !VALUE_TESTS$1053 }, function (t$1061) {
    t$1061.plan(1);
    t$1061.equal(P.value(P.pick([P.key('b')]))({}), undefined);
});
//test.skip('retrieve nested property', function(t) {
// //   t.plan(1);
// //   t.equal(a # b # {b: o}, 1);
// // });
test('pick named property as value', { skip: !VALUE_TESTS$1053 }, function (t$1065) {
    t$1065.plan(1);
    var prop$1067 = 'a';
    t$1065.equal(P.value(P.pick([P.key(prop$1067)]))(o$1052), 1);
});
test('pick mandatory missing property into value (throws)', { skip: !VALUE_TESTS$1053 }, function (t$1070) {
    t$1070.plan(2);
    t$1070.throws(function () {
        P.value(P.pick([P.must(P.key('b'))]))(o$1052);
    });
    t$1070.throws(function () {
        P.value(P.pick([P.must(P.key('b'))]))(null);
    });
});
test('pick missing property into value with default', { skip: !VALUE_TESTS$1053 }, function (t$1076) {
    t$1076.plan(1);
    t$1076.equal(P.value(P.pick([P.deflt(P.key('b'), 22)]))(o$1052), 22);
});
test('pick into value using pick function', { skip: !VALUE_TESTS$1053 }, function (t$1080) {
    t$1080.plan(2);
    var pickfunc$1083 = P.value(P.pick([P.key('a')]));
    t$1080.equal(typeof pickfunc$1083, 'function');
    t$1080.equal(pickfunc$1083(o$1052), 1);
});
// PICKING INTO OBJECTS
//test('renaming function: uppercase property names', function(t) {
//  t.plan(1);
//  // TODO: figure out why double parentheses are needed here.
//  t.deepEqual(o.{* as ((p => p.toUpperCase()))}, {A: 1});
//});
test('pick property into object', function (t$1086) {
    t$1086.plan(1);
    t$1086.deepEqual(P.object(P.pick([P.key('a')]))(o$1052), o$1052);
});
test('pick renamed property into object', function (t$1090) {
    t$1090.plan(1);
    t$1090.deepEqual(P.object(P.pick([P.rename(P.key('a'), 'b')]))(o$1052), { b: 1 });
});
test('pick missing mandatory property into object (throws)', function (t$1094) {
    t$1094.plan(1);
    t$1094.throws(function () {
        P.object(P.pick([P.must(P.key('b'))]))(o$1052);
    });
});
test('pick must-not-exist property into object (throws)', function (t$1098) {
    t$1098.plan(1);
    t$1098.throws(function () {
        P.object(P.pick([P.mustnot(P.key('a'))]))(o$1052);
    });
});
test('pick into object with default value', function (t$1102) {
    t$1102.plan(1);
    t$1102.deepEqual(P.object(P.pick([P.deflt(P.key('b'), 42)]))(o$1052), { b: 42 });
});
test('pick properties from array of name into object', function (t$1106) {
    t$1106.plan(1);
    var props$1108 = ['a'];
    t$1106.deepEqual(P.object(P.pick([P.key(props$1108)]))(o$1052), { a: 1 });
});
test('pick properties based on regexp', function (t$1111) {
    t$1111.plan(1);
    var regexp$1113 = /a/;
    t$1111.deepEqual(P.object(P.pick([P.key(regexp$1113)]))(o$1052), { a: 1 });
});
test('pick properties based on object properties', function (t$1116) {
    t$1116.plan(1);
    var obj$1118 = { a: 1 };
    t$1116.deepEqual(P.object(P.pick([P.key(obj$1118)]))(o$1052), { a: 1 });
});
//test.skip('invalid value* in picklist throws', function(t) {
//   t.plan(1);
//   var val = 22;
//   t.throws(function() { {(val)}. null; });
// });
test('rest operator picks up all props', function (t$1121) {
    t$1121.plan(1);
    t$1121.deepEqual(P.object(P.pick([
        P.key('a'),
        P.rest()
    ]))(o$1052), o$1052);
});
test('mandatory rest with no remaining properties (throws)', function (t$1125) {
    t$1125.plan(1);
    t$1125.throws(function () {
        P.object(P.pick([
            P.key('a'),
            P.must(P.rest())
        ]))(o$1052);
    });
});
test('pick from non-object should throw if #?', function (t$1129) {
    t$1129.plan(1);
    t$1129.throws(function () {
        P.object(P.pick([P.key('a')]))(P.guard(null));
    });
});
// // PICK INTO ARRAY
test('pick from property into array', function (t$1133) {
    t$1133.plan(1);
    t$1133.deepEqual(P.array(P.pick([P.key('a')]))(o$1052), [1]);
});
test('pick rest from object into array', function (t$1137) {
    t$1137.plan(1);
    t$1137.equal(P.array(P.pick([P.rest()]))(o$1052).length, 1);
});
test('pick from object into array with rename', function (t$1142) {
    t$1142.plan(1);
    // This will create an array of the form `[undefined, 1]`.
    t$1142.equal(P.array(P.pick([P.rename(P.key('a'), 1)]))(o$1052).length, 2);
});
// PICK FROM ARRAY INTO ARRAY
test('swap array elements', function (t$1147) {
    t$1147.plan(1);
    // This will create an array of the form `[undefined, 1]`.
    t$1147.deepEqual(P.array(P.pick([
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
test('pick from array into array using negative index', function (t$1151) {
    t$1151.plan(1);
    t$1151.deepEqual(P.array(P.pick([
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
test('pick from array into array using range', function (t$1155) {
    t$1155.plan(1);
    t$1155.deepEqual(P.array(P.pick([P.range(0, 1)]))([
        1,
        2
    ]), [
        1,
        2
    ]);
});
test('reverse array', function (t$1159) {
    t$1159.plan(1);
    t$1159.deepEqual(P.array(P.pick([P.range(-1, 0)]))([
        1,
        2,
        3
    ]), [
        3,
        2,
        1
    ]);
});
test('initialize array', function (t$1163) {
    t$1163.plan(1);
    t$1163.deepEqual(P.array(P.pick([P.deflt(P.range(0, 2), x$1167 => x$1167 * x$1167, true)]))([]), [
        0,
        1,
        4
    ]);
});
test('tail of array by omitting first element', function (t$1168) {
    t$1168.plan(1);
    t$1168.deepEqual(P.array(P.pick([
        P.omit(P.key(0)),
        P.rest()
    ]))([
        1,
        2
    ]), [2]);
});
test('splice array', function (t$1172) {
    t$1172.plan(1);
    t$1172.deepEqual(P.array(P.pick([
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
test('clone array', function (t$1176) {
    t$1176.plan(1);
    t$1176.deepEqual(P.array(P.pick([P.rest()]))([
        1,
        2
    ]), [
        1,
        2
    ]);
});
//test('flatten array', function(t) {
//  t.plan(1);
//  t.deepEqual(
//     [[1, 2], [3, 4]].[*.*],
//     [1, 2, 3, 4]
//   );
// });
test('clone array to two levels', function (t$1180) {
    var a$1181 = [
        [
            1,
            2
        ],
        [
            3,
            4
        ]
    ];
    t$1180.plan(1);
    t$1180.deepEqual(P.array(P.pick([P.apply(P.rest(), P.array(P.pick([P.rest()])))]))(a$1181), a$1181);
});
// test('pick first element of each subarray', function(t) {
//   t.plan(1);
//   t.deepEqual(
//     [[1, 2], [3, 4]].[* . 0],
//     [1, 3]
//   );
// });
// test('take first element of each subarray', function(t) {
//   t.plan(1);
//   t.deepEqual(
//     [[1, 2], [3, 4]].[*: [0]],
//     [[1], [3]]
//   );
// });
// When the property picked is a function, we must adjust the `this`
// in order to allow it to be called properly.
test('this handling', function (t$1185) {
    t$1185.plan(1);
    var o$1187 = {
        v: 42,
        f: function () {
            return this.v;
        }
    };
    var picker$1189 = P.value(P.pick([P.key('f')]));
    t$1185.equal(picker$1189(o$1187)(), 42);
});
// NESTED PICKS
test('nested pick', function (t$1192) {
    t$1192.plan(1);
    t$1192.deepEqual(P.object(P.pick([P.apply(P.key('a'), P.object(P.pick([P.key('b')])))]))({ a: { b: 1 } }), { a: { b: 1 } });
});
// Pick funcs
// PERFORMANCE ISSUE!!!
// test('pickfuncs as pickelts', function(t) {
//   var o = {a: 1, b: 2};
//   t.plan(3);
//   t.deepEqual(o.{.a}, {a: 1});
//   t.deepEqual(o.{.a, .b}, o);
//   t.deepEqual(o.{.a, .*}, o, 'rest as function');
// });
test('pickfunc from array of objects', function (t$1196) {
    t$1196.plan(1);
    var o$1198 = [
        { a: 1 },
        { a: 2 }
    ];
    t$1196.deepEqual(o$1198.map(P.value(P.pick([P.key('a')]))), [
        1,
        2
    ]);
});
// Grouped picks
test('grouped pick', function (t$1202) {
    // POSSIBLE PERFORMANCE
    t$1202.plan(1);
});
