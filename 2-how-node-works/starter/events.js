const EventEmmiter = require("events");
const http = require("http");

class Sales extends EventEmmiter {
  constructor() {
    super();
  }
}

const myEmmiter = new Sales();

myEmmiter.on("newSale", () => {
  console.log("There was a new sale");
});

myEmmiter.on("newSale", () => {
  console.log("Costumer name: Jonas");
});

myEmmiter.on("newSale", (stock) => {
  console.log(`There are now ${stock} items left in stock`);
});

myEmmiter.emit("newSale", 9);

const server = http.createServer();

server.on("request", (req, res) => {
  console.log("Request received");
  res.end("Request received");
});

server.on("request", (req, res) => {
  console.log("Another request");
});

server.on("close", (req, res) => {
  console.log("Server closed");
});

server.listen(8000, "127.0.0.1", () => {
  console.log("Waiting for requests");
});

// nastavi od Streams 36 video
// trebalo bi da se zapise za prethodni video tj za event emmitere
