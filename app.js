const express = require("express");
const app = express();
const mongoose = require("mongoose");
const hbs = require("hbs");
const path = require("path");

app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "views"));

app.get("/", (req, res, next) => {
  res.send("welcome");
});

app.listen(3000, () => {
  console.log(`listening on 3000`);
});
