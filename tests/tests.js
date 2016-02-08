import * as P from '..';
import { test } from 'tape';
var o$970 = { a: 1 };
// PICKING INTO VALUES
test('retrieve named property as value', function (t$971) {
    t$971.plan(2);
    t$971.equal(P.pickObjToVal(o$970, P.pick1('a')), 1);
    t$971.equal(P.pickObjToVal(o$970, P.pick1('a')), 1);
});
test('missing property yields undefined', function (t$974) {
    t$974.plan(1);
    t$974.equal(P.pickObjToVal({}, P.pick1('b')), undefined);
});
test('retrieve nested property', function (t$976) {
    t$976.plan(1);
    t$976.equal(P.pickObjToVal(P.pickObjToVal({ b: o$970 }, P.pick1('b')), P.pick1('a')), 1);
});
test('retrieve property with computed name', function (t$979) {
    t$979.plan(1);
    var prop$980 = 'a';
    t$979.equal(P.pickObjToVal(o$970, P.pick1(prop$980)), 1);
});
test('throw when retrieving mandatory property which does not exist', function (t$982) {
    t$982.plan(2);
    t$982.throws(function () {
        P.pickObjToVal(o$970, P.mandatory(P.pick1('b')));
    });
    t$982.throws(function () {
        P.pickObjToVal(0, P.mandatory(P.pick1('b')));
    });
});
// PICKING INTO OBJECTS
test('pick property into object', function (t$985) {
    t$985.plan(1);
    t$985.deepEqual(P.pickObjToObj(o$970, [P.pick1('a')]), o$970);
});
test('pick renamed property into object', function (t$987) {
    t$987.plan(1);
    t$987.deepEqual(P.pickObjToObj(o$970, [P.rename(P.pick1('a'), 'b')]), { b: 1 });
});
test('pick missing mandatory property into object', function (t$989) {
    t$989.plan(1);
    t$989.throws(function () {
        P.pickObjToObj(o$970, [P.mandatory(P.pick1('b'))]);
    });
});
test('pick must-not-exist property into object', function (t$991) {
    t$991.plan(1);
    t$991.throws(function () {
        P.pickObjToObj(o$970, [P.notexist(P.pick1('a'))]);
    });
});
test('pick with default value', function (t$993) {
    t$993.plan(1);
    t$993.deepEqual(P.pickObjToObj(o$970, [P.deflt(P.pick1('b'), 42)]), { b: 42 });
});
test('pick properties from array of name', function (t$995) {
    t$995.plan(1);
    var props$996 = ['a'];
    t$995.deepEqual(P.pickObjToObj(o$970, [P.pick1(props$996)]), { a: 1 });
});
test('pick properties based on regexp', function (t$998) {
    t$998.plan(1);
    var regexp$999 = /a/;
    t$998.deepEqual(P.pickObjToObj(o$970, [P.pick1(regexp$999)]), { a: 1 });
});
test('pick properties based on object properties', function (t$1001) {
    t$1001.plan(1);
    var obj$1002 = { a: 1 };
    t$1001.deepEqual(P.pickObjToObj(o$970, [P.pick1(obj$1002)]), { a: 1 });
});
test('invalid value* in picklist throws', function (t$1004) {
    t$1004.plan(1);
    var val$1005 = 22;
    t$1004.throws(function () {
        P.pickObjToObj(o$970, [P.pick1(val$1005)]);
    });
});
test('rest operator picks up all props', function (t$1007) {
    t$1007.plan(1);
    t$1007.deepEqual(P.pickObjToObj(o$970, [
        P.pick1('a'),
        P.rest()
    ]), o$970);
});
test('mandatory rest operator', function (t$1009) {
    t$1009.plan(1);
    t$1009.throws(function () {
        P.pickObjToObj(o$970, [
            P.pick1('a'),
            P.mandatory(P.rest())
        ]);
    });
});
test('pick assignment', function (t$1011) {
    t$1011.plan(1);
    var a$1012;
    a$1012 = P.pickObjToVal(o$970, P.pick1('a'));
    t$1011.equal(a$1012, 1);
});
test('pick from non-object should throw if #?', function (t$1015) {
    t$1015.plan(1);
    t$1015.throws(function () {
        P.pickObjToObj(P.check(0), [P.pick1('a')]);
    });
});
