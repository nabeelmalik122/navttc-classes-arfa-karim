const http = require("http");

const server = http.createServer((req, res) => {
  if (req.url === "/") {
    res.end("Hello from Node.js");
  }
});

server.listen(3000, () => {
  console.log("Server running on port 3000");
});
