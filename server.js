const dotenv = require("dotenv");

const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

const mongoose = require("mongoose");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);
const cookieParser = require("cookie-parser");
const path = require("path");
const port = 3000;

const userRouter = require("./routes/user");
const authRouter = require("./routes/auth");
const socket = require("./socket");

dotenv.config({ path: "./config.env" });

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.set("views", "./views");
app.set("view engine", "ejs");

app.use(express.static(path.join(__dirname, "public")));

app.use("/favicon.ico", (req, res, next) => {
  res.status(200);
});

// function wait(millisec) {
//   var now = new Date();
//   while (new Date() - now <= millisec);
// }

const uri = "mongodb://localhost:27017/qr-code";

const store = new MongoDBStore({
  uri: uri,
  collection: "mySessions",
});

app.use(
  require("express-session")({
    secret: "This is a secret",
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 7, // 1 week
    },
    store: store,
    // Boilerplate options, see:
    // * https://www.npmjs.com/package/express-session#resave
    // * https://www.npmjs.com/package/express-session#saveuninitialized
    resave: true,
    saveUninitialized: true,
  })
);

app.use("/auth", authRouter);
app.use("/user", userRouter);
app.use("/", (req, res, next) => {
  res.render("register");
});

mongoose
  .connect(uri)
  .then(() => {
    console.log("connected to database");
  })
  .catch((err) => {
    console.log(err.message);
  });

app.use(cookieParser("thuy"));
socket(io);

server.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
