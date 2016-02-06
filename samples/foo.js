import {pick, pickOne} from './runtime';
var o$804 = {
    a: 1,
    p: 22,
    nested: { v: 'v' }
};
var prop$805 = 'a';
console.log('===INDIVIDUAL PROPERTY ACCESS===');
console.log('The property a is', pickOne(o$804, { p: 'a' }));
console.log('The property given by prop is', pickOne(o$804, { p: prop$805 }));
console.log('The missing property b is', pickOne(o$804, { p: 'b' }));
console.log('Nested property is', pickOne(pickOne(o$804, { p: 'nested' }), { p: 'v' }));
try {
    pickOne(o$804, {
        p: 'b',
        f: true
    });
} catch (e$822) {
    console.log('Accessing mandatory property', e$822);
}
console.log('\n===PICKING INTO OBJECTS===');
console.log('Object containing a is', pick(o$804, [{ p: 'a' }]));
console.log('Object containing a and missing property b is', pick(o$804, [
    { p: 'a' },
    { p: 'b' }
]));
try {
    console.log('Object containing a and mandatory missing property b is', pick(o$804, [
        { p: 'a' },
        {
            p: 'b',
            f: true
        }
    ]));
} catch (e$824) {
    console.log(e$824);
}
try {
    console.log('Property which must not exist', pick(o$804, [{
            p: 'a',
            x: true
        }]));
} catch (e$826) {
    console.log('Accessing property which must not exist', e$826);
}
console.log('Object containing a renamed to foo is', pick(o$804, [{
        p: 'a',
        n: 'foo'
    }]));
console.log('Object with a default value is', pick(o$804, [{
        p: 'b',
        d: 42
    }]));
console.log('Extract properties in array', pickOne(o$804, { p: ['a'] }));
var regxp$816 = /p/;
console.log('Extract properties matching regexp /p/', pick(o$804, [{ p: regxp$816 }]));
console.log('\n===ASSIGNMENT PICK');
var a$818;
a$818 = pickOne(o$804, { p: 'a' });
console.log('Assigned value is', a$818);
