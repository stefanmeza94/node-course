const fs = require("fs");
const crypto = require("crypto");

const start = Date.now();
process.env.UV_THREADPOOL_SIZE = 4;

setTimeout(() => console.log("Timer 1 finished"), 0);
setImmediate(() => console.log("Immediate 1 finished"));

fs.readFile("test-file.txt", () => {
  console.log("I/O finished");

  setTimeout(() => console.log("Timer 2 finished"), 0);
  setTimeout(() => console.log("Timer 3 finished"), 3000);
  setImmediate(() => console.log("Immediate 2 finished"));

  process.nextTick(() => console.log("Process.nextTick"));

  // ovom sinhronom metodom smo blokirali taj single-thread u kom se izvrsava node prorgram, nasa setImmediate i setTimeout callback funkcije ce da se izvrse tek nakon ovo sinronog koda, iako su setovane da se izvrse odmah (bar jedan od njih) morace da cekaju na ukupno izvrsavanje sinhronog koda enkriptovanja passworda
  crypto.pbkdf2Sync("password", "salt", 100000, 1024, "sha512");
  console.log((Date.now() - start) / 1000, "Password encrypted 1");
  crypto.pbkdf2Sync("password", "salt", 100000, 1024, "sha512");
  console.log((Date.now() - start) / 1000, "Password encrypted 2");
  crypto.pbkdf2Sync("password", "salt", 100000, 1024, "sha512");
  console.log((Date.now() - start) / 1000, "Password encrypted 3");
  crypto.pbkdf2Sync("password", "salt", 100000, 1024, "sha512");
  console.log((Date.now() - start) / 1000, "Password encrypted 4");
});

console.log("Hello from the top-level code");

// nastavi od => section 04 - video 34 - Events and Evente-driven architecture
