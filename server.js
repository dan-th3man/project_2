const http = require("http");
const fs = require("fs");
const path = require("path");

const port = 3000;

let users = [];

// Load users from users.json into memory
function loadUsers() {
  if (fs.existsSync("users.json")) {
    const content = fs.readFileSync("users.json", "utf-8").trim();
    if (content) {
      users = JSON.parse(content);
    }
  }
}

// initial users loaded
loadUsers();

const server = http.createServer((req, res) => {
  console.log(`Request for: ${req.url}`);
  const url = req.url;
  const method = req.method;

  //signup 
  if (url === "/signup" && method === "POST") {
    let body = "";
    req.on("data", chunk => body += chunk);
    req.on("end", () => {
      try {
        const { username, password } = JSON.parse(body);
        loadUsers();

        if (users.some(u => u.username === username)) {
          res.writeHead(409, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ success: false, message: "User already exists" }));
        } else {
          users.push({ username, password });
          fs.writeFileSync("users.json", JSON.stringify(users, null, 2));
          loadUsers(); // update memory after write

          res.writeHead(200, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ success: true, username }));
        }
      } catch (err) {
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ success: false, message: "Bad JSON" }));
      }
    });
    return;
  }

  // login
  if (url === "/login" && method === "POST") {
    let body = "";
    req.on("data", chunk => body += chunk);
    req.on("end", () => {
      try {
        const { username, password } = JSON.parse(body);
        loadUsers();

        const user = users.find(u => u.username === username && u.password === password);
        if (user) {
          res.writeHead(200, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ success: true, username }));
        } else {
          res.writeHead(401, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ success: false }));
        }
      } catch (err) {
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ success: false, message: "Invalid JSON" }));
      }
    });
    return;
  }

  //read in questions
  if (url === "/questions.json" && method === "GET") {
    fs.readFile("./questions.json", (err, data) => {
      if (err) {
        res.writeHead(500);
        res.end("Error loading questions");
      } else {
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(data);
      }
    });
    return;
  }

  // submit quiz
  if (url === "/submit-quiz" && method === "POST") {
    let body = "";
    req.on("data", chunk => body += chunk);
    req.on("end", () => {
      const quizData = JSON.parse(body);
      console.log("Quiz submission:", quizData);

      let results = [];
      if (fs.existsSync("quiz-results.json")) {
        const lines = fs.readFileSync("quiz-results.json", "utf-8").trim().split("\n");
        results = lines.map(line => JSON.parse(line));
      }

      results.push(quizData);
      fs.writeFileSync("quiz-results.json", results.map(r => JSON.stringify(r)).join("\n"));

      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ message: "Quiz submitted successfully!" }));
    });
    return;
  }

  // leaderboard
  if (url === "/leaderboard" && method === "GET") {
    let results = [];
    if (fs.existsSync("quiz-results.json")) {
      const lines = fs.readFileSync("quiz-results.json", "utf-8").trim().split("\n");
      results = lines.map(line => JSON.parse(line));
    }

    results.sort((a, b) => b.score - a.score);
    const top = results.slice(0, 10);

    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(top));
    return;
  }

  // serve pages/files
  let filePath = "." + (url === "/" ? "/index.html" : url);
  const ext = path.extname(filePath);
  const contentTypeMap = {
    ".html": "text/html",
    ".css": "text/css",
    ".js": "application/javascript",
    ".json": "application/json",
    ".png": "image/png",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".gif": "image/gif",
    ".svg": "image/svg+xml",
    ".ico": "image/x-icon"
  };
  const contentType = contentTypeMap[ext] || "application/octet-stream";

  //error 404
  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404, { "Content-Type": "text/html" });
      res.end("<h1>404 Not Found</h1>");
    } else {
      res.writeHead(200, { "Content-Type": contentType });
      res.end(data);
    }
  });
});

//start the server
server.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
