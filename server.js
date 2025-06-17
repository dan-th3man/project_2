const http = require("http");
const fs = require("fs");

const port = 3000; 
const server = http.createServer();
 
server.on("listening", () => 
    console.log(`Server running on port ${port}`)
);

server.on("request", (req, res) => {
    res.writeHead(200, {"Content-type":"text/html"});
	const url = req.url
	console.log(url);
  //Display website
	fs.createReadStream("./index.html").pipe(res);
});

server.listen(port);
