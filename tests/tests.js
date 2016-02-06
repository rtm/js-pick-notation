import {pick, pickOne} from '..';
import { test } from 'tape';
var o$832 = { a: 1 };
// PICKING INTO VALUES
test('retrieve named property as value', function (t$833) {
    t$833.plan(2);
    t$833.equal(pickOne(o$832, { p: 'a' }), 1);
    t$833.equal(pickOne(o$832, { p: 'a' }), 1);
});
test('missing property yields undefined', function (t$836) {
    t$836.plan(1);
    t$836.equal(pickOne({}, { p: 'b' }), undefined);
});
test('retrieve nested property', function (t$838) {
    t$838.plan(1);
    t$838.equal(pickOne(pickOne({ b: o$832 }, { p: 'b' }), { p: 'a' }), 1);
});
test('retrieve property with computed name', function (t$841) {
    t$841.plan(1);
    var prop$842 = 'a';
    t$841.equal(pickOne(o$832, { p: prop$842 }), 1);
});
test('throw when retrieving mandatory property which does not exist', function (t$844) {
    t$844.plan(2);
    t$844.throws(function () {
        pickOne(o$832, {
            p: 'b',
            f: true
        });
    });
    t$844.throws(function () {
        pickOne(0, {
            p: 'b',
            f: true
        });
    });
});
// PICKING INTO OBJECTS
test('pick property into object', function (t$847) {
    t$847.plan(1);
    t$847.deepEqual(pick(o$832, [{ p: 'a' }]), o$832);
});
test('pick renamed property into object', function (t$849) {
    t$849.plan(1);
    t$849.deepEqual(pick(o$832, [{
            p: 'a',
            n: 'b'
        }]), { b: 1 });
});
test('pick missing mandatory property into object', function (t$851) {
    t$851.plan(1);
    t$851.throws(function () {
        pick(o$832, [{
                p: 'b',
                f: true
            }]);
    });
});
test('pick must-not-exist property into object', function (t$853) {
    t$853.plan(1);
    t$853.throws(function () {
        pick(o$832, [{
                p: 'a',
                x: true
            }]);
    });
});
test('pick with default value', function (t$855) {
    t$855.plan(1);
    t$855.deepEqual(pick(o$832, [{
            p: 'b',
            d: 42
        }]), { b: 42 });
});
test('pick properties from array of name', function (t$857) {
    t$857.plan(1);
    var props$858 = ['a'];
    t$857.deepEqual(pick(o$832, [{ p: props$858 }]), { a: 1 });
});
test('pick properties based on regexp', function (t$860) {
    t$860.plan(1);
    var regexp$861 = /a/;
    t$860.deepEqual(pick(o$832, [{ p: regexp$861 }]), { a: 1 });
});
test('pick properties based on object properties', function (t$863) {
    t$863.plan(1);
    var obj$864 = { a: 1 };
    t$863.deepEqual(pick(o$832, [{ p: obj$864 }]), { a: 1 });
});
test('invalid [value] in picklist throws', function (t$866) {
    t$866.plan(1);
    var val$867 = 22;
    t$866.throws(function () {
        pick(o$832, [{ p: val$867 }]);
    });
});
test('rest operator picks up all props', function (t$869) {
    t$869.plan(1);
    t$869.deepEqual(pick(o$832, [
        { p: 'a' },
        { r: true }
    ]), o$832);
});
test('mandatory rest operator', function (t$871) {
    t$871.plan(1);
    t$871.throws(function () {
        pick(o$832, [
            { p: 'a' },
            {
                r: true,
                f: true
            }
        ]);
    });
});
