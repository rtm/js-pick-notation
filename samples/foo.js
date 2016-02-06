import {pick, pickOne} from '..';
pickOne(b$848, { p: 'a' });
var o$833 = {
    a: 1,
    p: 22,
    nested: { v: 'v' }
};
var prop$834 = 'a';
console.log('===INDIVIDUAL PROPERTY ACCESS===');
console.log('The property a is', pickOne(o$833, { p: 'a' }));
console.log('The property given by prop is', pickOne(o$833, { p: prop$834 }));
console.log('The missing property b is', pickOne(o$833, { p: 'b' }));
console.log('Nested property is', pickOne(pickOne(o$833, { p: 'nested' }), { p: 'v' }));
try {
    pickOne(o$833, {
        p: 'b',
        f: true
    });
} catch (e$852) {
    console.log('Accessing mandatory property', e$852);
}
console.log('\n===PICKING INTO OBJECTS===');
console.log('Object containing a is', pick(o$833, [{ p: 'a' }]));
console.log('Object containing a and missing property b is', pick(o$833, [
    { p: 'a' },
    { p: 'b' }
]));
try {
    console.log('Object containing a and mandatory missing property b is', pick(o$833, [
        { p: 'a' },
        {
            p: 'b',
            f: true
        }
    ]));
} catch (e$854) {
    console.log(e$854);
}
try {
    console.log('Property which must not exist', pick(o$833, [{
            p: 'a',
            x: true
        }]));
} catch (e$856) {
    console.log('Accessing property which must not exist', e$856);
}
console.log('Object containing a renamed to foo is', pick(o$833, [{
        p: 'a',
        n: 'foo'
    }]));
console.log('Object with a default value is', pick(o$833, [{
        p: 'b',
        d: 42
    }]));
console.log('Extract properties in array', pickOne(o$833, { p: ['a'] }));
var regxp$845 = /p/;
console.log('Extract properties matching regexp /p/', pick(o$833, [{ p: regxp$845 }]));
console.log('\n===ASSIGNMENT PICK');
var a$847, b$848;
a$847 = pickOne(o$833, { p: 'a' });
console.log('Assigned value is', a$847);
