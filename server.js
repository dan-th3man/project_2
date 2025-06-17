const http = require("http");
const fs = require("fs");

const port = 3000;
//submit login info
const users = [
  { username: "testuser", password: "1234" },
  { username: "alice", password: "pass" }
];

const server = http.createServer((req, res) => {
  const url = req.url;
  const method = req.method;

  if (url === "/" && method === "GET") {
    res.writeHead(200, { "Content-Type": "text/html" });
    fs.createReadStream("./index.html").pipe(res);
  }

  else if (url === "/login" && method === "POST") {
    let body = "";
    req.on("data", chunk => body += chunk);
    req.on("end", () => {
      const { username, password } = JSON.parse(body);
      const user = users.find(u => u.username === username && u.password === password);
      if (user) {
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ success: true, username }));
      } else {
        res.writeHead(401, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ success: false }));
      }
    });
  }
  //questions
  if (req.url === "/questions.json" && req.method === "GET") {
  res.writeHead(200, { "Content-Type": "application/json" });
  fs.createReadStream("./questions.json").pipe(res);
}
//submit answers 
  else if (url === "/submit-quiz" && method === "POST") {
    let body = "";
    req.on("data", chunk => body += chunk);
    req.on("end", () => {
      const quizData = JSON.parse(body);
      console.log("Quiz submission:", quizData);

      fs.appendFile("quiz-results.json", JSON.stringify(quizData) + "\n", err => {
        if (err) console.error("Save error:", err);
      });

      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ message: "Quiz submitted successfully!" }));
    });
  }

  else {
    res.writeHead(404, { "Content-Type": "text/plain" });
    res.end("Not Found");
  }
});

server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
