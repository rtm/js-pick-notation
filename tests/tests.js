import * as P from '..';
import { test } from 'tape';
var o$1053 = { a: 1 };
var VALUE_TESTS$1054 = true;
var OBJECT_TESTS$1055 = true;
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
test('pick named property as value', { skip: !VALUE_TESTS$1054 }, function (t$1056) {
    t$1056.plan(2);
    t$1056.equal(P.value(P.pick([P.key('a')]))(o$1053), 1);
    t$1056.equal(P.value(P.pick([P.key('a')]))(o$1053), 1);
});
test('pick missing property as value (yields undefined)', { skip: !VALUE_TESTS$1054 }, function (t$1062) {
    t$1062.plan(1);
    t$1062.equal(P.value(P.pick([P.key('b')]))({}), undefined);
});
//test.skip('retrieve nested property', function(t) {
// //   t.plan(1);
// //   t.equal(a # b # {b: o}, 1);
// // });
test('pick named property as value', { skip: !VALUE_TESTS$1054 }, function (t$1066) {
    t$1066.plan(1);
    var prop$1068 = 'a';
    t$1066.equal(P.value(P.pick([P.key(prop$1068)]))(o$1053), 1);
});
test('pick mandatory missing property into value (throws)', { skip: !VALUE_TESTS$1054 }, function (t$1071) {
    t$1071.plan(2);
    t$1071.throws(function () {
        P.value(P.pick([P.must(P.key('b'))]))(o$1053);
    });
    t$1071.throws(function () {
        P.value(P.pick([P.must(P.key('b'))]))(null);
    });
});
test('pick missing property into value with default', { skip: !VALUE_TESTS$1054 }, function (t$1077) {
    t$1077.plan(1);
    t$1077.equal(P.value(P.pick([P.deflt(P.key('b'), 22)]))(o$1053), 22);
});
test('pick into value using pick function', { skip: !VALUE_TESTS$1054 }, function (t$1081) {
    t$1081.plan(2);
    var pickfunc$1084 = P.value(P.pick([P.key('a')]));
    t$1081.equal(typeof pickfunc$1084, 'function');
    t$1081.equal(pickfunc$1084(o$1053), 1);
});
// PICKING INTO OBJECTS
//test('renaming function: uppercase property names', function(t) {
//  t.plan(1);
//  // TODO: figure out why double parentheses are needed here.
//  t.deepEqual(o.{* as ((p => p.toUpperCase()))}, {A: 1});
//});
test('pick property into object', function (t$1087) {
    t$1087.plan(1);
    t$1087.deepEqual(P.object(P.pick([P.key('a')]))(o$1053), o$1053);
});
test('pick renamed property into object', function (t$1091) {
    t$1091.plan(1);
    t$1091.deepEqual(P.object(P.pick([P.rename(P.key('a'), 'b')]))(o$1053), { b: 1 });
});
test('pick missing mandatory property into object (throws)', function (t$1095) {
    t$1095.plan(1);
    t$1095.throws(function () {
        P.object(P.pick([P.must(P.key('b'))]))(o$1053);
    });
});
test('pick must-not-exist property into object (throws)', function (t$1099) {
    t$1099.plan(1);
    t$1099.throws(function () {
        P.object(P.pick([P.mustnot(P.key('a'))]))(o$1053);
    });
});
test('pick into object with default value', function (t$1103) {
    t$1103.plan(1);
    t$1103.deepEqual(P.object(P.pick([P.deflt(P.key('b'), 42)]))(o$1053), { b: 42 });
});
test('pick properties from array of name into object', function (t$1107) {
    t$1107.plan(1);
    var props$1109 = ['a'];
    t$1107.deepEqual(P.object(P.pick([P.key(props$1109)]))(o$1053), { a: 1 });
});
test('pick properties based on regexp', function (t$1112) {
    t$1112.plan(1);
    var regexp$1114 = /a/;
    t$1112.deepEqual(P.object(P.pick([P.key(regexp$1114)]))(o$1053), { a: 1 });
});
test('pick properties based on object properties', function (t$1117) {
    t$1117.plan(1);
    var obj$1119 = { a: 1 };
    t$1117.deepEqual(P.object(P.pick([P.key(obj$1119)]))(o$1053), { a: 1 });
});
//test.skip('invalid value* in picklist throws', function(t) {
//   t.plan(1);
//   var val = 22;
//   t.throws(function() { {(val)}. null; });
// });
test('rest operator picks up all props', function (t$1122) {
    t$1122.plan(1);
    t$1122.deepEqual(P.object(P.pick([
        P.key('a'),
        P.rest()
    ]))(o$1053), o$1053);
});
test('mandatory rest with no remaining properties (throws)', function (t$1126) {
    t$1126.plan(1);
    t$1126.throws(function () {
        P.object(P.pick([
            P.key('a'),
            P.must(P.rest())
        ]))(o$1053);
    });
});
test('pick from non-object should throw if #?', function (t$1130) {
    t$1130.plan(1);
    t$1130.throws(function () {
        P.object(P.pick([P.key('a')]))(P.guard(null));
    });
});
// // PICK INTO ARRAY
test('pick from property into array', function (t$1134) {
    t$1134.plan(1);
    t$1134.deepEqual(P.array(P.pick([P.key('a')]))(o$1053), [1]);
});
test('pick rest from object into array', function (t$1138) {
    t$1138.plan(1);
    t$1138.equal(P.array(P.pick([P.rest()]))(o$1053).length, 1);
});
test('pick from object into array with rename', function (t$1143) {
    t$1143.plan(1);
    // This will create an array of the form `[undefined, 1]`.
    t$1143.equal(P.array(P.pick([P.rename(P.key('a'), 1)]))(o$1053).length, 2);
});
// PICK FROM ARRAY INTO ARRAY
test('swap array elements', function (t$1148) {
    t$1148.plan(1);
    // This will create an array of the form `[undefined, 1]`.
    t$1148.deepEqual(P.array(P.pick([
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
test('pick from array into array using negative index', function (t$1152) {
    t$1152.plan(1);
    t$1152.deepEqual(P.array(P.pick([
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
test('pick from array into array using range', function (t$1156) {
    t$1156.plan(1);
    t$1156.deepEqual(P.array(P.pick([P.range(0, 1)]))([
        1,
        2
    ]), [
        1,
        2
    ]);
});
test('reverse array', function (t$1160) {
    t$1160.plan(1);
    t$1160.deepEqual(P.array(P.pick([P.range(-1, 0)]))([
        1,
        2,
        3
    ]), [
        3,
        2,
        1
    ]);
});
test('initialize array', function (t$1164) {
    t$1164.plan(1);
    t$1164.deepEqual(P.array(P.pick([P.deflt(P.range(0, 2), x$1168 => x$1168 * x$1168, true)]))([]), [
        0,
        1,
        4
    ]);
});
test('tail of array by omitting first element', function (t$1169) {
    t$1169.plan(1);
    t$1169.deepEqual(P.array(P.pick([
        P.omit(P.key(0)),
        P.rest()
    ]))([
        1,
        2
    ]), [2]);
});
test('splice array', function (t$1173) {
    t$1173.plan(1);
    t$1173.deepEqual(P.array(P.pick([
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
test('clone array', function (t$1177) {
    t$1177.plan(1);
    t$1177.deepEqual(P.array(P.pick([P.rest()]))([
        1,
        2
    ]), [
        1,
        2
    ]);
});
test('flatten array', function (t$1181) {
    t$1181.plan(1);
    t$1181.deepEqual(P.array(P.pick([P.deep(P.rest(), P.pick([P.rest()]))]))([
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
test('clone array to two levels', function (t$1257) {
    var a$1258 = [
        [
            1,
            2
        ],
        [
            3,
            4
        ]
    ];
    t$1257.plan(1);
    t$1257.deepEqual(P.array(P.pick([P.apply(P.rest(), P.array(P.pick([P.rest()])))]))(a$1258), a$1258);
});
test('pick first element of each subarray', function (t$1262) {
    t$1262.plan(1);
    t$1262.deepEqual(P.array(P.pick([P.deep(P.rest(), P.pick([P.key(0)]))]))([
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
test('take first element of each subarray', function (t$1338) {
    t$1338.plan(1);
    t$1338.deepEqual(P.array(P.pick([P.apply(P.rest(), P.array(P.pick([P.key(0)])))]))([
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
test('this handling', function (t$1342) {
    t$1342.plan(1);
    var o$1344 = {
        v: 42,
        f: function () {
            return this.v;
        }
    };
    var picker$1346 = P.value(P.pick([P.key('f')]));
    t$1342.equal(picker$1346(o$1344)(), 42);
});
// NESTED PICKS
test('nested pick', function (t$1349) {
    t$1349.plan(1);
    t$1349.deepEqual(P.object(P.pick([P.apply(P.key('a'), P.object(P.pick([P.key('b')])))]))({ a: { b: 1 } }), { a: { b: 1 } });
});
// Pick funcs
test('pickfuncs as pickelts', function (t$1353) {
    var o$1354 = {
        a: 1,
        b: 2
    };
    t$1353.plan(3);
    t$1353.deepEqual(P.object(P.pick([P.key(P.value(P.pick([P.key('a')])))]))(o$1354), { a: 1 });
    t$1353.deepEqual(P.object(P.pick([
        P.key(P.value(P.pick([P.key('a')]))),
        P.key(P.value(P.pick([P.key('b')])))
    ]))(o$1354), o$1354);
    t$1353.deepEqual(P.object(P.pick([
        P.key(P.value(P.pick([P.key('a')]))),
        P.key(P.value(P.pick([P.rest()])))
    ]))(o$1354), o$1354, 'rest as function');
});
test('pickfunc from array of objects', function (t$1842) {
    t$1842.plan(1);
    var o$1844 = [
        { a: 1 },
        { a: 2 }
    ];
    t$1842.deepEqual(o$1844.map(P.value(P.pick([P.key('a')]))), [
        1,
        2
    ]);
});
// Grouped picks
test('grouped pick', function (t$1848) {
    t$1848.plan(4);
    // Basic grouped pick.
    t$1848.deepEquals(P.object(P.pick([P.pick([
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
    t$1848.deepEquals(P.object(P.pick([P.rename(P.pick([
            P.key('a'),
            P.key('b')
        ]), p$1857 => p$1857 + '1')]))({
        a: 1,
        b: 2,
        c: 3
    }), {
        a1: 1,
        b1: 2
    }, 'Renaming grouped pick');
    // Apply renaming func with index to all members of group.
    t$1848.deepEquals(P.object(P.pick([P.rename(P.pick([
            P.key('a'),
            P.key('b')
        ]), (p$1858, i$1859) => 'x' + i$1859)]))({
        a: 1,
        b: 2,
        c: 3
    }), {
        x0: 1,
        x1: 2
    }, 'Renaming grouped pick with index');
    // Apply must-not operator to all members of group.
    t$1848.throws(function () {
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
