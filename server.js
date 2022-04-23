const express = require("express");
const app = express();
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const port = 3000;

const userRouter = require("./routes/user");

dotenv.config({ path: "./config.env" });

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

mongoose
  .connect("mongodb://localhost:27017/qr-code")
  .then(() => {
    console.log("connected to database");
  })
  .catch((err) => {
    console.log(err.message);
  });

app.use("/api", userRouter);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
