const express = require("express");
const morgan = require("morgan");

const app = express();
const host = "localhost";
const port = 3000;

app.set("views", "./views");
app.set("view engine", "pug");

app.use(morgan("common"));

app.get("/", (req, res) => {
//
});

app.listen(port, localhost, () => {
  console.log(`Habit tracker is listening on port ${port} of ${host}...`);
});