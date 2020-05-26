const express = require("express");
const app = express();
const morgan = require("morgan");
const productRoutes = require("./api/routes/products");
const orderRoutes = require("./api/routes/orders");
const userRoutes = require("./api/routes/users");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const uri =
  "mongodb+srv://muzi:1234@cluster0-6rwxz.mongodb.net/test?retryWrites=true&w=majority";
mongoose
  .connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("MongoDB Connected…");
  })
  .catch((err) => console.log(err));

app.use(morgan("dev"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use("/uploads", express.static("uploads"));

app.use((res, req, next) => {
  res.header("Acess-Control-Allow-Origin", "*");
  res.header("Acess-Control-Allow-Headers", "*");
  if (req.method === "options") {
    res.header("Acess-Control-Allow-Methods", "PUT,DELETE,POST,PATCH,GET");
    return res.status(200).json({});
  }
  next();
});

app.use("/products", productRoutes);
app.use("/orders", orderRoutes);
app.use("/user", userRoutes);

app.use((req, res, next) => {
  const error = new Error("Not Found");
  error.status(404);
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
