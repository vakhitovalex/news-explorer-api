const express = require("express");
const mongoose = require("mongoose");

const app = express();

const { PORT = 3001 } = process.env;

// connect to the MongoDB server
mongoose.connect("mongodb://localhost:27017/news-explorer", {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

// connect the middleware, routes, etc...

app.listen(PORT, () => {
  console.log(`App is working at ${PORT}`);
});
