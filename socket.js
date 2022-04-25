const { log } = require("npmlog");
const User = require("./models/User");

module.exports = (io) => {
  io.on("connection", (socket) => {
    console.log("a user connected");

    socket.on("result", async (data) => {
      let { decodedText } = data;
      const newUser = new User(JSON.parse(decodedText));
      await newUser.save();
      console.log("create candidate successfully");

      console.log(newUser);

      const users = await User.find({});

      socket.emit("update-table", users);
    });
  });
};
