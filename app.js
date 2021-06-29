const express = require("express");
const app = express();
const port = process.env.PORT||3000
const morgan = require("morgan");
const mongoose = require("mongoose");
require('dotenv').config()
app.use(morgan("dev"));
app.use('/uploads',express.static('uploads'));
const URI = `mongodb+srv://erdldncr:${process.env.PASSWORD}@cluster0.gawog.mongodb.net/cluster0?retryWrites=true&w=majority`;

mongoose.connect(URI, {
  useFindAndModify: true,
  useUnifiedTopology: true,
  useNewUrlParser: true,
},()=>{
    console.log('cconnected')
});

app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "*");
  if (req.method == "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "PUT,POST,PATCH, DELETE, GET");
    return res.status(200).json({});
  }
  next();
});
app.use(express.static("public"));
app.use("/product", require("./api/routes/products"));

app.use("/order", require("./api/routes/orders"));

app.use('/user',require('./api/routes/user'))

app.use((req, res, next) => {
  const error = new Error("Not Found");
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message,
    },
  });
});

module.exports = app;
