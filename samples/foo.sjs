var o = {a:1, p:22, nested: {v:'v'}};
var prop = 'a';

console.log("===INDIVIDUAL PROPERTY ACCESS===");
console.log("The property a is", a # o);
console.log("The property given by prop is", [prop] # o);
console.log("The missing property b is", b # o);
console.log("Nested property is", v # nested # o);
try { b! # o } catch(e) { console.log("Accessing mandatory property", e); }

console.log("\n===PICKING INTO OBJECTS===");
console.log("Object containing a is", {a} # o);
console.log("Object containing a and missing property b is", {a, b} # o);
try {
  console.log("Object containing a and mandatory missing property b is", {a, b!} # o);
} catch (e) {console.log(e); }

try { console.log("Property which must not exist", {a^} # o); } catch(e) { console.log("Accessing property which must not exist", e); }

console.log("Object containing a renamed to foo is", {a:foo} # o);
console.log("Object with a default value is", {b=42} # o);

console.log("Extract properties in array", [['a']] # o);

var regxp = /p/;
console.log("Extract properties matching regexp /p/", {[regxp]} # o);

console.log('\n===ASSIGNMENT PICK');
var a;
a #= o;
console.log("Assigned value is", a);
