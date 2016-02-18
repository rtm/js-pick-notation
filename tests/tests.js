import * as P from '..';
import { test } from 'tape';
var o$1046 = { a: 1 };
var VALUE_TESTS$1047 = true;
var OBJECT_TESTS$1048 = true;
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
test('pick named property as value', { skip: !VALUE_TESTS$1047 }, function (t$1049) {
    t$1049.plan(2);
    t$1049.equal(P.value(P.pick([P.key('a')]))(o$1046), 1);
    t$1049.equal(P.value(P.pick([P.key('a')]))(o$1046), 1);
});
test('pick missing property as value (yields undefined)', { skip: !VALUE_TESTS$1047 }, function (t$1055) {
    t$1055.plan(1);
    t$1055.equal(P.value(P.pick([P.key('b')]))({}), undefined);
});
//test.skip('retrieve nested property', function(t) {
// //   t.plan(1);
// //   t.equal(a # b # {b: o}, 1);
// // });
test('pick named property as value', { skip: !VALUE_TESTS$1047 }, function (t$1059) {
    t$1059.plan(1);
    var prop$1061 = 'a';
    t$1059.equal(P.value(P.pick([P.key(prop$1061)]))(o$1046), 1);
});
test('pick mandatory missing property into value (throws)', { skip: !VALUE_TESTS$1047 }, function (t$1064) {
    t$1064.plan(2);
    t$1064.throws(function () {
        P.value(P.pick([P.must(P.key('b'))]))(o$1046);
    });
    t$1064.throws(function () {
        P.value(P.pick([P.must(P.key('b'))]))(null);
    });
});
test('pick missing property into value with default', { skip: !VALUE_TESTS$1047 }, function (t$1070) {
    t$1070.plan(1);
    t$1070.equal(P.value(P.pick([P.deflt(P.key('b'), 22)]))(o$1046), 22);
});
test('pick into value using pick function', { skip: !VALUE_TESTS$1047 }, function (t$1074) {
    t$1074.plan(2);
    var pickfunc$1077 = P.value(P.pick([P.key('a')]));
    t$1074.equal(typeof pickfunc$1077, 'function');
    t$1074.equal(pickfunc$1077(o$1046), 1);
});
// PICKING INTO OBJECTS
//test('renaming function: uppercase property names', function(t) {
//  t.plan(1);
//  // TODO: figure out why double parentheses are needed here.
//  t.deepEqual(o.{... -> ((p => p.toUpperCase()))}, {A: 1});
//});
test('pick property into object', function (t$1080) {
    t$1080.plan(1);
    t$1080.deepEqual(P.object(P.pick([P.key('a')]))(o$1046), o$1046);
});
test('pick renamed property into object', function (t$1084) {
    t$1084.plan(1);
    t$1084.deepEqual(P.object(P.pick([P.rename(P.key('a'), 'b')]))(o$1046), { b: 1 });
});
test('pick missing mandatory property into object (throws)', function (t$1088) {
    t$1088.plan(1);
    t$1088.throws(function () {
        P.object(P.pick([P.must(P.key('b'))]))(o$1046);
    });
});
test('pick must-not-exist property into object (throws)', function (t$1092) {
    t$1092.plan(1);
    t$1092.throws(function () {
        P.object(P.pick([P.mustnot(P.key('a'))]))(o$1046);
    });
});
test('pick into object with default value', function (t$1096) {
    t$1096.plan(1);
    t$1096.deepEqual(P.object(P.pick([P.deflt(P.key('b'), 42)]))(o$1046), { b: 42 });
});
test('pick properties from array of name into object', function (t$1100) {
    t$1100.plan(1);
    var props$1102 = ['a'];
    t$1100.deepEqual(P.object(P.pick([P.key(props$1102)]))(o$1046), { a: 1 });
});
test('pick properties based on regexp', function (t$1105) {
    t$1105.plan(1);
    var regexp$1107 = /a/;
    t$1105.deepEqual(P.object(P.pick([P.key(regexp$1107)]))(o$1046), { a: 1 });
});
test('pick properties based on object properties', function (t$1110) {
    t$1110.plan(1);
    var obj$1112 = { a: 1 };
    t$1110.deepEqual(P.object(P.pick([P.key(obj$1112)]))(o$1046), { a: 1 });
});
//test.skip('invalid value* in picklist throws', function(t) {
//   t.plan(1);
//   var val = 22;
//   t.throws(function() { {(val)}. null; });
// });
test('rest operator picks up all props', function (t$1115) {
    t$1115.plan(1);
    t$1115.deepEqual(P.object(P.pick([
        P.key('a'),
        P.rest()
    ]))(o$1046), o$1046);
});
test('mandatory rest with no remaining properties (throws)', function (t$1119) {
    t$1119.plan(1);
    t$1119.throws(function () {
        P.object(P.pick([
            P.key('a'),
            P.must(P.rest())
        ]))(o$1046);
    });
});
test('pick from non-object should throw if #?', function (t$1123) {
    t$1123.plan(1);
    t$1123.throws(function () {
        P.object(P.pick([P.key('a')]))(P.guard(null));
    });
});
// // PICK INTO ARRAY
test('pick from property into array', function (t$1127) {
    t$1127.plan(1);
    t$1127.deepEqual(P.array(P.pick([P.key('a')]))(o$1046), [1]);
});
test('pick rest from object into array', function (t$1131) {
    t$1131.plan(1);
    t$1131.equal(P.array(P.pick([P.rest()]))(o$1046).length, 1);
});
test('pick from object into array with rename', function (t$1136) {
    t$1136.plan(1);
    // This will create an array of the form `[undefined, 1]`.
    t$1136.equal(P.array(P.pick([P.rename(P.key('a'), 1)]))(o$1046).length, 2);
});
// PICK FROM ARRAY INTO ARRAY
test('swap array elements', function (t$1141) {
    t$1141.plan(1);
    // This will create an array of the form `[undefined, 1]`.
    t$1141.deepEqual(P.array(P.pick([
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
test('pick from array into array using negative index', function (t$1145) {
    t$1145.plan(1);
    t$1145.deepEqual(P.array(P.pick([
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
test('pick from array into array using range', function (t$1149) {
    t$1149.plan(1);
    t$1149.deepEqual(P.array(P.pick([P.range(0, 1)]))([
        1,
        2
    ]), [
        1,
        2
    ]);
});
test('reverse array', function (t$1153) {
    t$1153.plan(1);
    t$1153.deepEqual(P.array(P.pick([P.range(-1, 0)]))([
        1,
        2,
        3
    ]), [
        3,
        2,
        1
    ]);
});
test('initialize array', function (t$1157) {
    t$1157.plan(1);
    t$1157.deepEqual(P.array(P.pick([P.deflt(P.range(0, 2), x$1161 => x$1161 * x$1161, true)]))([]), [
        0,
        1,
        4
    ]);
});
test('tail of array by omitting first element', function (t$1162) {
    t$1162.plan(1);
    t$1162.deepEqual(P.array(P.pick([
        P.omit(P.key(0)),
        P.rest()
    ]))([
        1,
        2
    ]), [2]);
});
test('splice array', function (t$1166) {
    t$1166.plan(1);
    t$1166.deepEqual(P.array(P.pick([
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
test('this handling', function (t$1170) {
    t$1170.plan(1);
    var o$1172 = {
        v: 42,
        f: function () {
            return this.v;
        }
    };
    var picker$1174 = P.value(P.pick([P.key('f')]));
    t$1170.equal(picker$1174(o$1172)(), 42);
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
test('pickfuncs as pickelts', function (t$1177) {
    var o$1178 = {
        a: 1,
        b: 2
    };
    t$1177.plan(3);
    t$1177.deepEqual(P.object(P.pick([P.key(P.value(P.pick([P.key('a')])))]))(o$1178), { a: 1 });
    t$1177.deepEqual(P.object(P.pick([
        P.key(P.value(P.pick([P.key('a')]))),
        P.key(P.value(P.pick([P.key('b')])))
    ]))(o$1178), o$1178);
    t$1177.deepEqual(P.object(P.pick([
        P.key(P.value(P.pick([P.key('a')]))),
        P.key(P.value(P.pick([P.rest()])))
    ]))(o$1178), o$1178, 'rest as function');
});
test('pickfunc from array of objects', function (t$1426) {
    t$1426.plan(1);
    var o$1428 = [
        { a: 1 },
        { a: 2 }
    ];
    t$1426.deepEqual(o$1428.map(P.value(P.pick([P.key('a')]))), [
        1,
        2
    ]);
});
// Grouped picks
test('grouped pick', function (t$1432) {
    t$1432.plan(4);
    // Basic grouped pick.
    t$1432.deepEquals(P.object(P.pick([P.pick([
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
    t$1432.deepEquals(P.object(P.pick([P.rename(P.pick([
            P.key('a'),
            P.key('b')
        ]), p$1441 => p$1441 + '1')]))({
        a: 1,
        b: 2,
        c: 3
    }), {
        a1: 1,
        b1: 2
    }, 'Renaming grouped pick');
    // Apply renaming func with index to all members of group.
    t$1432.deepEquals(P.object(P.pick([P.rename(P.pick([
            P.key('a'),
            P.key('b')
        ]), (p$1442, i$1443) => 'x' + i$1443)]))({
        a: 1,
        b: 2,
        c: 3
    }), {
        x0: 1,
        x1: 2
    }, 'Renaming grouped pick');
    // Apply must-not operator to all members of group.
    t$1432.throws(function () {
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
