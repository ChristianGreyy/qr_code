const { log } = require("npmlog");
const User = require("./models/User");

module.exports = (io) => {
  io.on("connection", (socket) => {
    console.log("a user connected");

    socket.on("result", async (data) => {
      // console.log(data);
      let { decodedText } = data;
      // console.log(JSON.parse(decodedText));
      // const duplicatedUser = await User.findOne({
      //   sududentCode: JSON.parse(decodedText).studentCode,
      // });
      // console.log(duplicatedUser);
      // if (duplicatedUser) {
      //   return;
      // }
      const newUser = new User(JSON.parse(decodedText));
      await newUser.save();
      console.log("create candidate successfully");

      const users = await User.find({ role: "candidate" });

      socket.emit("update-table", users);
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
