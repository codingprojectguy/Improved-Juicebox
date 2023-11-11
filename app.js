const express = require("express");
const morgan = require("morgan");
const path = require("path");
const app = express();

app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// console.log("__dirname", __dirname);
// console.log("path:", path.join(__dirname, "public/index.html"));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public/index.html"));
});
app.get("/client.js", (req, res) => {
  res.sendFile(path.join(__dirname, "public/client.js"));
});

app.use("/api/auth", require("./api/auth"));
app.use("/api/posts", require("./api/posts"));
module.exports = app;
