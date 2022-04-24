const dotenv = require("dotenv");

const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const path = require("path");
const port = 3000;

const userRouter = require("./routes/user");
const authRouter = require("./routes/auth");

dotenv.config({ path: "./config.env" });

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.set("views", "./views");
app.set("view engine", "ejs");

app.use(express.static(path.join(__dirname, "public")));

app.use("/api", userRouter);
app.use("/", (req, res, next) => {
  res.render("register");
});

mongoose
  .connect("mongodb://localhost:27017/qr-code")
  .then(() => {
    console.log("connected to database");
  })
  .catch((err) => {
    console.log(err.message);
  });

app.use(cookieParser("thuy"));

app.use("/api", userRouter);
app.use("/api/auth", authRouter);

io.on("connection", (socket) => {
  console.log("a user connected");

  socket.on("result", (data) => {
    console.log(data);
  });
});

server.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
