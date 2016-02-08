import * as P from '..';
import { test } from 'tape';
var o$942 = { a: 1 };
// PICKING INTO VALUES
test('retrieve named property as value', function (t$943) {
    t$943.plan(2);
    t$943.equal(P.pickVal(o$942, P.pick1('a')), 1);
    t$943.equal(P.pickVal(o$942, P.pick1('a')), 1);
});
test('missing property yields undefined', function (t$946) {
    t$946.plan(1);
    t$946.equal(P.pickVal({}, P.pick1('b')), undefined);
});
test('retrieve nested property', function (t$948) {
    t$948.plan(1);
    t$948.equal(P.pickVal(P.pickVal({ b: o$942 }, P.pick1('b')), P.pick1('a')), 1);
});
test('retrieve property with computed name', function (t$951) {
    t$951.plan(1);
    var prop$952 = 'a';
    t$951.equal(P.pickVal(o$942, P.pick1(prop$952)), 1);
});
test('throw when retrieving mandatory property which does not exist', function (t$954) {
    t$954.plan(2);
    t$954.throws(function () {
        P.pickVal(o$942, P.mandatory(P.pick1('b')));
    });
    t$954.throws(function () {
        P.pickVal(0, P.mandatory(P.pick1('b')));
    });
});
// PICKING INTO OBJECTS
test('pick property into object', function (t$957) {
    t$957.plan(1);
    t$957.deepEqual(P.pickObj(o$942, [P.pick1('a')]), o$942);
});
test('pick renamed property into object', function (t$959) {
    t$959.plan(1);
    t$959.deepEqual(P.pickObj(o$942, [P.rename(P.pick1('a'), 'b')]), { b: 1 });
});
test('pick missing mandatory property into object', function (t$961) {
    t$961.plan(1);
    t$961.throws(function () {
        P.pickObj(o$942, [P.mandatory(P.pick1('b'))]);
    });
});
test('pick must-not-exist property into object', function (t$963) {
    t$963.plan(1);
    t$963.throws(function () {
        P.pickObj(o$942, [P.notexist(P.pick1('a'))]);
    });
});
test('pick with default value', function (t$965) {
    t$965.plan(1);
    t$965.deepEqual(P.pickObj(o$942, [P.deflt(P.pick1('b'), 42)]), { b: 42 });
});
test('pick properties from array of name', function (t$967) {
    t$967.plan(1);
    var props$968 = ['a'];
    t$967.deepEqual(P.pickObj(o$942, [P.pick1(props$968)]), { a: 1 });
});
test('pick properties based on regexp', function (t$970) {
    t$970.plan(1);
    var regexp$971 = /a/;
    t$970.deepEqual(P.pickObj(o$942, [P.pick1(regexp$971)]), { a: 1 });
});
test('pick properties based on object properties', function (t$973) {
    t$973.plan(1);
    var obj$974 = { a: 1 };
    t$973.deepEqual(P.pickObj(o$942, [P.pick1(obj$974)]), { a: 1 });
});
test('invalid [value] in picklist throws', function (t$976) {
    t$976.plan(1);
    var val$977 = 22;
    t$976.throws(function () {
        P.pickObj(o$942, [P.pick1(val$977)]);
    });
});
test('rest operator picks up all props', function (t$979) {
    t$979.plan(1);
    t$979.deepEqual(P.pickObj(o$942, [
        P.pick1('a'),
        P.rest()
    ]), o$942);
});
test('mandatory rest operator', function (t$981) {
    t$981.plan(1);
    t$981.throws(function () {
        P.pickObj(o$942, [
            P.pick1('a'),
            P.mandatory(P.rest())
        ]);
    });
});
test('pick assignment', function (t$983) {
    t$983.plan(1);
    var a$984;
    a$984 = P.pickVal(o$942, P.pick1('a'));
    t$983.equal(a$984, 1);
});
