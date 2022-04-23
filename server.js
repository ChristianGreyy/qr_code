const express = require("express");
const app = express();
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const path = require('path');
const port = 3000;

const userRouter = require("./routes/user");

dotenv.config({ path: "./config.env" });

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.set('views', './views')
app.set('view engine', 'ejs')

app.use(express.static(path.join(__dirname, 'public')))

mongoose
  .connect("mongodb://localhost:27017/qr-code")
  .then(() => {
    console.log("connected to database");
  })
  .catch((err) => {
    console.log(err.message);
  });

app.use("/api", userRouter);
app.use('/', (req, res, next) => {
  res.render('register')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
