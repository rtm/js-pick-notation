import * as P from '..';
import { test } from 'tape';
var o$1048 = { a: 1 };
var VALUE_TESTS$1049 = true;
var OBJECT_TESTS$1050 = true;
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
test('pick named property as value', { skip: !VALUE_TESTS$1049 }, function (t$1051) {
    t$1051.plan(2);
    t$1051.equal(P.value(P.pick([P.key('a')]))(o$1048), 1);
    t$1051.equal(P.value(P.pick([P.key('a')]))(o$1048), 1);
});
test('pick missing property as value (yields undefined)', { skip: !VALUE_TESTS$1049 }, function (t$1057) {
    t$1057.plan(1);
    t$1057.equal(P.value(P.pick([P.key('b')]))({}), undefined);
});
//test.skip('retrieve nested property', function(t) {
// //   t.plan(1);
// //   t.equal(a # b # {b: o}, 1);
// // });
test('pick named property as value', { skip: !VALUE_TESTS$1049 }, function (t$1061) {
    t$1061.plan(1);
    var prop$1063 = 'a';
    t$1061.equal(P.value(P.pick([P.key(prop$1063)]))(o$1048), 1);
});
test('pick mandatory missing property into value (throws)', { skip: !VALUE_TESTS$1049 }, function (t$1066) {
    t$1066.plan(2);
    t$1066.throws(function () {
        P.value(P.pick([P.must(P.key('b'))]))(o$1048);
    });
    t$1066.throws(function () {
        P.value(P.pick([P.must(P.key('b'))]))(null);
    });
});
test('pick missing property into value with default', { skip: !VALUE_TESTS$1049 }, function (t$1072) {
    t$1072.plan(1);
    t$1072.equal(P.value(P.pick([P.deflt(P.key('b'), 22)]))(o$1048), 22);
});
test('pick into value using pick function', { skip: !VALUE_TESTS$1049 }, function (t$1076) {
    t$1076.plan(2);
    var pickfunc$1079 = P.value(P.pick([P.key('a')]));
    t$1076.equal(typeof pickfunc$1079, 'function');
    t$1076.equal(pickfunc$1079(o$1048), 1);
});
// PICKING INTO OBJECTS
//test('renaming function: uppercase property names', function(t) {
//  t.plan(1);
//  // TODO: figure out why double parentheses are needed here.
//  t.deepEqual(o.{... -> ((p => p.toUpperCase()))}, {A: 1});
//});
test('pick property into object', function (t$1082) {
    t$1082.plan(1);
    t$1082.deepEqual(P.object(P.pick([P.key('a')]))(o$1048), o$1048);
});
test('pick renamed property into object', function (t$1086) {
    t$1086.plan(1);
    t$1086.deepEqual(P.object(P.pick([P.rename(P.key('a'), 'b')]))(o$1048), { b: 1 });
});
test('pick missing mandatory property into object (throws)', function (t$1090) {
    t$1090.plan(1);
    t$1090.throws(function () {
        P.object(P.pick([P.must(P.key('b'))]))(o$1048);
    });
});
test('pick must-not-exist property into object (throws)', function (t$1094) {
    t$1094.plan(1);
    t$1094.throws(function () {
        P.object(P.pick([P.mustnot(P.key('a'))]))(o$1048);
    });
});
test('pick into object with default value', function (t$1098) {
    t$1098.plan(1);
    t$1098.deepEqual(P.object(P.pick([P.deflt(P.key('b'), 42)]))(o$1048), { b: 42 });
});
test('pick properties from array of name into object', function (t$1102) {
    t$1102.plan(1);
    var props$1104 = ['a'];
    t$1102.deepEqual(P.object(P.pick([P.key(props$1104)]))(o$1048), { a: 1 });
});
test('pick properties based on regexp', function (t$1107) {
    t$1107.plan(1);
    var regexp$1109 = /a/;
    t$1107.deepEqual(P.object(P.pick([P.key(regexp$1109)]))(o$1048), { a: 1 });
});
test('pick properties based on object properties', function (t$1112) {
    t$1112.plan(1);
    var obj$1114 = { a: 1 };
    t$1112.deepEqual(P.object(P.pick([P.key(obj$1114)]))(o$1048), { a: 1 });
});
//test.skip('invalid value* in picklist throws', function(t) {
//   t.plan(1);
//   var val = 22;
//   t.throws(function() { {(val)}. null; });
// });
test('rest operator picks up all props', function (t$1117) {
    t$1117.plan(1);
    t$1117.deepEqual(P.object(P.pick([
        P.key('a'),
        P.rest()
    ]))(o$1048), o$1048);
});
test('mandatory rest with no remaining properties (throws)', function (t$1121) {
    t$1121.plan(1);
    t$1121.throws(function () {
        P.object(P.pick([
            P.key('a'),
            P.must(P.rest())
        ]))(o$1048);
    });
});
test('pick from non-object should throw if #?', function (t$1125) {
    t$1125.plan(1);
    t$1125.throws(function () {
        P.object(P.pick([P.key('a')]))(P.guard(null));
    });
});
// // PICK INTO ARRAY
test('pick from property into array', function (t$1129) {
    t$1129.plan(1);
    t$1129.deepEqual(P.array(P.pick([P.key('a')]))(o$1048), [1]);
});
test('pick rest from object into array', function (t$1133) {
    t$1133.plan(1);
    t$1133.equal(P.array(P.pick([P.rest()]))(o$1048).length, 1);
});
test('pick from object into array with rename', function (t$1138) {
    t$1138.plan(1);
    // This will create an array of the form `[undefined, 1]`.
    t$1138.equal(P.array(P.pick([P.rename(P.key('a'), 1)]))(o$1048).length, 2);
});
// PICK FROM ARRAY INTO ARRAY
test('swap array elements', function (t$1143) {
    t$1143.plan(1);
    // This will create an array of the form `[undefined, 1]`.
    t$1143.deepEqual(P.array(P.pick([
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
test('pick from array into array using negative index', function (t$1147) {
    t$1147.plan(1);
    t$1147.deepEqual(P.array(P.pick([
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
test('pick from array into array using range', function (t$1151) {
    t$1151.plan(1);
    t$1151.deepEqual(P.array(P.pick([P.range(0, 1)]))([
        1,
        2
    ]), [
        1,
        2
    ]);
});
test('reverse array', function (t$1155) {
    t$1155.plan(1);
    t$1155.deepEqual(P.array(P.pick([P.range(-1, 0)]))([
        1,
        2,
        3
    ]), [
        3,
        2,
        1
    ]);
});
test('initialize array', function (t$1159) {
    t$1159.plan(1);
    t$1159.deepEqual(P.array(P.pick([P.deflt(P.range(0, 2), x$1163 => x$1163 * x$1163, true)]))([]), [
        0,
        1,
        4
    ]);
});
test('tail of array by omitting first element', function (t$1164) {
    t$1164.plan(1);
    t$1164.deepEqual(P.array(P.pick([
        P.omit(P.key(0)),
        P.rest()
    ]))([
        1,
        2
    ]), [2]);
});
test('splice array', function (t$1168) {
    t$1168.plan(1);
    t$1168.deepEqual(P.array(P.pick([
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
test('clone array', function (t$1172) {
    t$1172.plan(1);
    t$1172.deepEqual(P.array(P.pick([P.rest()]))([
        1,
        2
    ]), [
        1,
        2
    ]);
});
test('flatten array', function (t$1176) {
    t$1176.plan(1);
    t$1176.deepEqual(P.array(P.pick([P.deep(P.rest(), P.pick([P.rest()]))]))([
        [
            1,
            2
        ],
        [
            3,
            4
        ]
    ]), [
        1,
        2,
        3,
        4
    ]);
});
test('clone array to two levels', function (t$1234) {
    var a$1235 = [
        [
            1,
            2
        ],
        [
            3,
            4
        ]
    ];
    t$1234.plan(1);
    t$1234.deepEqual(P.array(P.pick([P.apply(P.rest(), P.array(P.pick([P.rest()])))]))(a$1235), a$1235);
});
test('pick first element of each subarray', function (t$1239) {
    t$1239.plan(1);
    t$1239.deepEqual(P.array(P.pick([P.deep(P.rest(), P.pick([P.key(0)]))]))([
        [
            1,
            2
        ],
        [
            3,
            4
        ]
    ]), [
        1,
        3
    ]);
});
test('take first element of each subarray', function (t$1297) {
    t$1297.plan(1);
    t$1297.deepEqual(P.array(P.pick([P.apply(P.rest(), P.array(P.pick([P.key(0)])))]))([
        [
            1,
            2
        ],
        [
            3,
            4
        ]
    ]), [
        [1],
        [3]
    ]);
});
// When the property picked is a function, we must adjust the `this`
// in order to allow it to be called properly.
test('this handling', function (t$1301) {
    t$1301.plan(1);
    var o$1303 = {
        v: 42,
        f: function () {
            return this.v;
        }
    };
    var picker$1305 = P.value(P.pick([P.key('f')]));
    t$1301.equal(picker$1305(o$1303)(), 42);
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
test('pickfuncs as pickelts', function (t$1308) {
    var o$1309 = {
        a: 1,
        b: 2
    };
    t$1308.plan(3);
    t$1308.deepEqual(P.object(P.pick([P.key(P.value(P.pick([P.key('a')])))]))(o$1309), { a: 1 });
    t$1308.deepEqual(P.object(P.pick([
        P.key(P.value(P.pick([P.key('a')]))),
        P.key(P.value(P.pick([P.key('b')])))
    ]))(o$1309), o$1309);
    t$1308.deepEqual(P.object(P.pick([
        P.key(P.value(P.pick([P.key('a')]))),
        P.key(P.value(P.pick([P.rest()])))
    ]))(o$1309), o$1309, 'rest as function');
});
test('pickfunc from array of objects', function (t$1677) {
    t$1677.plan(1);
    var o$1679 = [
        { a: 1 },
        { a: 2 }
    ];
    t$1677.deepEqual(o$1679.map(P.value(P.pick([P.key('a')]))), [
        1,
        2
    ]);
});
// Grouped picks
test('grouped pick', function (t$1683) {
    t$1683.plan(4);
    // Basic grouped pick.
    t$1683.deepEquals(P.object(P.pick([P.pick([
            P.key('a'),
            P.key('b')
        ])]))({
        a: 1,
        b: 2,
        c: 3
    }), {
        a: 1,
        b: 2
    }, 'Basic grouped pick');
    // Apply renaming func to all members of group.
    t$1683.deepEquals(P.object(P.pick([P.rename(P.pick([
            P.key('a'),
            P.key('b')
        ]), p$1692 => p$1692 + '1')]))({
        a: 1,
        b: 2,
        c: 3
    }), {
        a1: 1,
        b1: 2
    }, 'Renaming grouped pick');
    // Apply renaming func with index to all members of group.
    t$1683.deepEquals(P.object(P.pick([P.rename(P.pick([
            P.key('a'),
            P.key('b')
        ]), (p$1693, i$1694) => 'x' + i$1694)]))({
        a: 1,
        b: 2,
        c: 3
    }), {
        x0: 1,
        x1: 2
    }, 'Renaming grouped pick with index');
    // Apply must-not operator to all members of group.
    t$1683.throws(function () {
        P.object(P.pick([P.mustnot(P.pick([
                P.key('a'),
                P.key('b')
            ]))]))({
            a: 1,
            b: 2,
            c: 3
        });
    });
});
