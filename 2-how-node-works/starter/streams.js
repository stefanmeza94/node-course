const fs = require("fs");
const http = require("http");

// recimo da zelimo da iscitamo jako veliki fajl i da ga posaljemo klijentu, za to postoji mnogo nacina ali ajde da krenemo od najprostijeg

const server = http.createServer();

server.on("request", (req, res) => {
  // Solution 1 - ovo ce raditi super ali node ce ovde morati da ucita ceo fajl u memoriji i tek nakon sto se to obavi moze da ga posalje klijentu. Ovo je bitno kada je fajl dosta veliki i kad dosta zahteva stizu sa klijentske strane. Node proces ce vrlo brzo da ostane bez resursa. Tako da ce nasa node aplikacija da blokira sa radom. Tako da ova solucija nije dobra za produkciju, vec samo za neke manje stvari.

  //   fs.readFile("test-file.txt", (err, data) => {
  //     if (err) console.log(err);
  //     res.end(data);
  //   });

  // Solution 2: Streams - usmesto da ucitavamo podatke u varijalbu i storujemo tu varijablu negde u memoriji, mi cemo samo da kreiramo readable stream. Tako da kako primamo deo po deo od tog podataka, slacemo ga kao response kroz writable stream. Kad god dolazi novi deo tog nekog fajla koji iscitavamo deo po deo, readable stream ce da emituje data event. Tako da mozemo da osluskujemo taj event. Mi ovim zapravo stremujemo sadrzaj fajla klijentu.

  //   const readable = fs.createReadStream("test-file.txt");
  //   readable.on("data", (chunk) => {
  //     // res je writable stream
  //     res.write(chunk);
  //   });

  // takodje moramo da hendlujemo event slucaj kada je ceo sadrzaj ucitan iz fajla, zapravo kada stream zavrsi iscitavanje fajla.
  //   readable.on("end", () => {
  //     res.end();
  //   });

  // postoji jos jedan event koji mozemo da salusamo na readable stream a to je error
  //   readable.on("error", (error) => {
  //     console.log(error);
  //     res.statusCode(500);
  //     res.end("File not found");
  //   });

  // medjutim postoji problem i sa sloucijom broj 2, a to je readable stream koji koristimo da iscitamo fajl iz kompijutera je mnogo brzi od slanja rezultata sa responsom iz writable streama preko interneta. Ovo ce da preoptereti response stream, odnosno nece moci da se snadje sa tim nadolazecim podacima is readable strema toliko brzo. Taj problem se popularno naziva backpresure. Dakle backpresure se desava kada response ne moze da salje podatke ni priblizno brzo kao sto ih prima iz fajla.

  // solution 3: resenje za problem iznad jeste da koristimo pipe() funkciju. Pipe operator je dostpuan na svim readable stream-ovima, on nam omogucava da prenosimo rezultate iz readable stream-a pravo u writable stream. To ce onda da popravi problem backpresure-a. Zato sto ce pipe da regulise brzinu dobijanja podataka iz readable stream-a kao sto regulise i brzinu pisanja tih podataka.
  const readable = fs.createReadStream("test-file.txt");
  readable.pipe(res);
});

// uvek moramo da startujemo server
server.listen(8000, "127.0.0.1", () => {
  console.log("Listening...");
});
