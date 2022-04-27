const { log } = require("npmlog");
const User = require("./models/User");

module.exports = (io) => {
  io.on("connection", (socket) => {
    console.log("a user connected");

    socket.on("result", async (data) => {
      let { decodedText } = data;
      const duplicatedUser = await User.findOne({
        studentCode: JSON.parse(decodedText).studentCode,
      });

      if (duplicatedUser) {
        console.log("duplicate data");
        io.emit("duplicated", "error");
        return;
      }
      const newUser = new User(JSON.parse(decodedText));
      await newUser.save();
      console.log("create candidate successfully");

      const users = await User.find({ role: "candidate" });

      io.emit("update-table", users);
    });

    socket.on("client-update-point", async (data) => {
      const user = await User.findOne({ _id: data.userId });
      user.point = data.point;
      const result = await user.save();
      console.log(result);
      console.log("update point successfully");
    });
    socket.on("client-update-comment", async (data) => {
      const user = await User.findOne({ _id: data.userId });
      user.comment = data.comment;
      const result = await user.save();
      console.log(result);
      console.log("update comment successfully");
    });
    socket.on("client-input-studentCode", async (studentCode) => {
      const users = await User.find({ studentCode });
      console.log(users);
      socket.emit("update-table", users);
    });
  });
};
