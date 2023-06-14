// console.log(arguments);
// console.log(require("module").wrapper);

// module exports
const C = require("./test-module-1");
const calc1 = new C();
console.log(calc1.add(2, 5));

// exports
const { add, mulitply } = require("./test-module-2.js");
console.log(mulitply(5, 2));

// caching
require("./test-module-3")();
require("./test-module-3")();
require("./test-module-3")();
