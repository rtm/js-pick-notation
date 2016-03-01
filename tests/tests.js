import * as P from '..';
import { test } from 'tape';
var o$967 = { a: 1 };
var VALUE_TESTS$968 = true;
var OBJECT_TESTS$969 = true;
// PICKING INTO VALUES
test('pick named property as value', { skip: !VALUE_TESTS$968 }, function (t$972) {
    t$972.plan(2);
    t$972.equal(P.value(P.list(P.modify(P.key('a'), [])))(o$967), 1);
    t$972.equal(P.value(P.list(P.modify(P.key('a'), [])))(o$967), 1);
});
test('pick missing property as value (yields undefined)', { skip: !VALUE_TESTS$968 }, function (t$978) {
    t$978.plan(1);
    t$978.equal(P.value(P.list(P.modify(P.key('b'), [])))({}), undefined);
});
test('retrieve nested property', function (t$982) {
    t$982.plan(1);
    t$982.equal(P.value(P.list(P.modify(P.key('a'), [P.deep(P.key('b'))])))({ a: { b: 1 } }), 1);
});
test('pick named property as value', { skip: !VALUE_TESTS$968 }, function (t$987) {
    t$987.plan(1);
    var prop$989 = 'a';
    t$987.equal(P.value(P.list(P.modify(P.key(prop$989), [])))(o$967), 1);
});
test('pick mandatory missing property into value (throws)', { skip: !VALUE_TESTS$968 }, function (t$992) {
    t$992.plan(2);
    t$992.throws(function () {
        P.value(P.list(P.modify(P.key('b'), [P.must()])))(o$967);
    });
    t$992.throws(function () {
        P.value(P.list(P.modify(P.key('b'), [P.must()])))(null);
    });
});
test('pick missing property into value with default', { skip: !VALUE_TESTS$968 }, function (t$998) {
    t$998.plan(1);
    t$998.equal(P.value(P.list(P.modify(P.key('b'), [P.deflt(22)])))(o$967), 22);
});
test('pick into value using pick function', { skip: !VALUE_TESTS$968 }, function (t$1002) {
    t$1002.plan(2);
    var pickfunc$1005 = P.value(P.list(P.modify(P.key('a'), [])));
    t$1002.equal(typeof pickfunc$1005, 'function');
    t$1002.equal(pickfunc$1005(o$967), 1);
});
// PICKING INTO OBJECTS
test('renaming function: uppercase property names', function (t$1008) {
    t$1008.plan(1);
    // TODO: figure out why double parentheses are needed here.
    t$1008.deepEqual(P.object(P.list(P.modify(P.rest(), [P.rename(p$1013 => p$1013.toUpperCase())])))(o$967), { A: 1 });
});
test('pick property into object', function (t$1014) {
    t$1014.plan(1);
    t$1014.deepEqual(P.object(P.list(P.modify(P.key('a'), [])))(o$967), o$967);
});
test('pick renamed property into object', function (t$1018) {
    t$1018.plan(1);
    t$1018.deepEqual(P.object(P.list(P.modify(P.key('a'), [P.rename('b')])))(o$967), { b: 1 });
});
test('pick missing mandatory property into object (throws)', function (t$1022) {
    t$1022.plan(1);
    t$1022.throws(function () {
        P.object(P.list(P.modify(P.key('b'), [P.must()])))(o$967);
    });
});
test('pick must-not-exist property into object (throws)', function (t$1026) {
    t$1026.plan(1);
    t$1026.throws(function () {
        P.object(P.list(P.modify(P.key('a'), [P.mustnot()])))(o$967);
    });
});
test('pick into object with default value', function (t$1030) {
    t$1030.plan(1);
    t$1030.deepEqual(P.object(P.list(P.modify(P.key('b'), [P.deflt(42)])))(o$967), { b: 42 });
});
test('pick properties from array of name into object', function (t$1034) {
    t$1034.plan(1);
    var props$1036 = ['a'];
    t$1034.deepEqual(P.object(P.list(P.modify(P.key(props$1036), [])))(o$967), { a: 1 });
});
test('pick properties based on regexp', function (t$1039) {
    t$1039.plan(1);
    var regexp$1041 = /a/;
    t$1039.deepEqual(P.object(P.list(P.modify(P.key(regexp$1041), [])))(o$967), { a: 1 });
});
test('pick properties based on object properties', function (t$1044) {
    t$1044.plan(1);
    var obj$1046 = { a: 1 };
    t$1044.deepEqual(P.object(P.list(P.modify(P.key(obj$1046), [])))(o$967), { a: 1 });
});
test.skip('invalid value* in picklist throws', function (t$1049) {
    t$1049.plan(1);
    var val$1051 = 22;
    t$1049.throws(function () {
        P.object(P.list(P.modify(P.key(val$1051), [])))(null);
    });
});
test('rest operator picks up all props', function (t$1054) {
    t$1054.plan(1);
    t$1054.deepEqual(P.object(P.list(P.modify(P.key('a'), []), P.modify(P.rest(), [])))(o$967), o$967);
});
test('mandatory rest with no remaining properties (throws)', function (t$1058) {
    t$1058.plan(1);
    t$1058.throws(function () {
        P.object(P.list(P.modify(P.key('a'), []), P.modify(P.rest(), [P.must()])))(o$967);
    });
});
test('pick from non-object should throw if #?', function (t$1062) {
    t$1062.plan(1);
    t$1062.throws(function () {
        P.object(P.list(P.modify(P.key('a'), []))).guard()(null);
    });
});
// PICK INTO ARRAY
test('pick from property into array', function (t$1066) {
    t$1066.plan(1);
    t$1066.deepEqual(P.array(P.list(P.modify(P.key('a'), [])))(o$967), [1]);
});
test('pick rest from object into array', function (t$1070) {
    t$1070.plan(1);
    t$1070.equal(P.array(P.list(P.modify(P.rest(), [])))(o$967).length, 1);
});
test('pick from object into array with rename', function (t$1075) {
    t$1075.plan(1);
    // This will create an array of the form `[undefined, 1]`.
    t$1075.equal(P.array(P.list(P.modify(P.key('a'), [P.rename(1)])))(o$967).length, 2);
});
// PICK FROM ARRAY INTO ARRAY
test('swap array elements', function (t$1080) {
    t$1080.plan(1);
    t$1080.deepEqual(P.array(P.list(P.modify(P.key(1), []), P.modify(P.key(0), [])))([
        1,
        2
    ]), [
        2,
        1
    ]);
});
test('pick from array into array using negative index', function (t$1084) {
    t$1084.plan(1);
    t$1084.deepEqual(P.array(P.list(P.modify(P.key(-1), []), P.modify(P.key(-2), [])))([
        1,
        2
    ]), [
        2,
        1
    ]);
});
test('pick from array into array using range', function (t$1088) {
    t$1088.plan(1);
    t$1088.deepEqual(P.array(P.list(P.modify(P.range(0, 1), [])))([
        1,
        2
    ]), [
        1,
        2
    ]);
});
test('reverse array', function (t$1092) {
    t$1092.plan(1);
    t$1092.deepEqual(P.array(P.list(P.modify(P.range(-1, 0), [])))([
        1,
        2,
        3
    ]), [
        3,
        2,
        1
    ]);
});
test('initialize array', function (t$1096) {
    t$1096.plan(1);
    t$1096.deepEqual(P.array(P.list(P.modify(P.range(0, 2), [P.deflt(x$1100 => x$1100 * x$1100, true)])))([]), [
        0,
        1,
        4
    ]);
});
test('tail of array by omitting first element', function (t$1101) {
    t$1101.plan(1);
    t$1101.deepEqual(P.array(P.list(P.modify(P.key(0), [P.omit()]), P.modify(P.rest(), [])))([
        1,
        2
    ]), [2]);
});
test('splice array', function (t$1105) {
    t$1105.plan(1);
    t$1105.deepEqual(P.array(P.list(P.modify(P.range(1, 2), [P.omit()]), P.modify(P.rest(), [])))([
        1,
        2,
        3,
        4
    ]), [
        1,
        4
    ]);
});
test('clone array', function (t$1109) {
    t$1109.plan(1);
    t$1109.deepEqual(P.array(P.list(P.modify(P.rest(), [])))([
        1,
        2
    ]), [
        1,
        2
    ]);
});
test('flatten array', function (t$1113) {
    t$1113.plan(1);
    t$1113.deepEqual(P.array(P.list(P.modify(P.rest(), [P.deep(P.rest())])))([
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
test('clone array to two levels', function (t$1119) {
    var a$1120 = [
        [
            1,
            2
        ],
        [
            3,
            4
        ]
    ];
    t$1119.plan(1);
    t$1119.deepEqual(P.array(P.list(P.modify(P.rest(), [P.nest(P.rest())])))(a$1120), a$1120);
});
test('pick first element of each subarray', function (t$1130) {
    t$1130.plan(1);
    t$1130.deepEqual(P.array(P.list(P.modify(P.rest(), [P.deep(P.key(0))])))([
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
test('take first element of each subarray', function (t$1136) {
    t$1136.plan(1);
    t$1136.deepEqual(P.array(P.list(P.modify(P.rest(), [P.nest(P.key([0]))])))([
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
test('this handling', function (t$1146) {
    t$1146.plan(1);
    var o$1148 = {
        v: 42,
        f: function () {
            return this.v;
        }
    };
    var picker$1150 = P.value(P.modify(P.key('f'), []));
    t$1146.equal(picker$1150(o$1148)(), 42);
});
// NESTED PICKS
test('nested pick', function (t$1153) {
    t$1153.plan(1);
    t$1153.deepEqual(P.object(P.list(P.modify(P.key('a'), [P.nest(P.key('b'))])))({ a: { b: 1 } }), { a: { b: 1 } });
});
// Pick funcs
test('pickfuncs as pickelts', function (t$1160) {
    var o$1161 = {
        a: 1,
        b: 2
    };
    t$1160.plan(3);
    t$1160.deepEqual(P.object(P.list(P.modify(P.key(P.value(P.modify(P.key('a'), []))), [])))(o$1161), { a: 1 });
    t$1160.deepEqual(P.object(P.list(P.modify(P.key(P.value(P.modify(P.key('a'), []))), []), P.modify(P.key(P.value(P.modify(P.key('b'), []))), [])))(o$1161), o$1161);
    t$1160.deepEqual(P.object(P.list(P.modify(P.key(P.value(P.modify(P.key('a'), []))), []), P.modify(P.key(P.value(P.modify(P.rest(), []))), [])))(o$1161), o$1161, 'rest as function');
});
test.skip('pickfunc from array of objects', function (t$1179) {
    t$1179.plan(1);
    var o$1181 = [
        { a: 1 },
        { a: 2 }
    ];
    t$1179.deepEqual(o$1181.map(P.value(P.modify(P.key('a'), []))), [
        1,
        2
    ]);
});
// Grouped picks
test('grouped pick', function (t$1185) {
    t$1185.plan(1);
    t$1185.deepEquals(P.object(P.list(P.modify(P.list(P.modify(P.key('a'), []), P.modify(P.key('b'), [])), [])))({
        a: 1,
        b: 2,
        c: 3
    }), {
        a: 1,
        b: 2
    }, 'Basic grouped pick');
});
test('apply renaming func to all members of group', function (t$1189) {
    t$1189.plan(1);
    t$1189.deepEquals(P.object(P.list(P.modify(P.list(P.modify(P.key('a'), []), P.modify(P.key('b'), [])), [P.rename(p$1193 => p$1193 + '1')])))({
        a: 1,
        b: 2,
        c: 3
    }), {
        a1: 1,
        b1: 2
    });
});
test('apply renaming func with index to all members of group', function (t$1194) {
    t$1194.plan(1);
    t$1194.deepEquals(P.object(P.list(P.modify(P.list(P.modify(P.key('a'), []), P.modify(P.key('b'), [])), [P.rename((p$1198, i$1199) => 'x' + i$1199)])))({
        a: 1,
        b: 2,
        c: 3
    }), {
        x0: 1,
        x1: 2
    });
});
test('apply must-not operator to all members of group', function (t$1200) {
    t$1200.plan(1);
    t$1200.throws(function () {
        P.object(P.list(P.modify(P.list(P.modify(P.key('a'), []), P.modify(P.key('b'), [])), [P.mustnot()])))({
            a: 1,
            b: 2,
            c: 3
        });
    });
});
