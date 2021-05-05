const express = require("express");
const mongoose = require("mongoose");

const app = express();

// connect to the MongoDB server
mongoose.connect("mongodb://localhost:27017/news", {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

// connect the middleware, routes, etc...

app.listen(3000);
