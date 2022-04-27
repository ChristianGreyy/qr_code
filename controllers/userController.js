const User = require("../models/User");
const asyncHandle = require("../untils/asyncHandle");
const qr = require("qrcode");

module.exports = {
  getUsers: asyncHandle(async (req, res, next) => {
    const { page } = req.query;
    let users;
    if (!page) {
      users = await User.find({});
    }
    const numbers = await User.countDocuments();
    const numberPage = numbers / 10 + 1;
    res.render("candidate", {
      users,
    });
  }),
  createUserQr: asyncHandle(async (req, res, next) => {
    console.log(req.body);
    let strData = JSON.stringify(req.body);

    qr.toString(strData, { type: "terminal" }, function (err, code) {
      if (err) return console.log("erropzr occurred");
      // console.log(code);
    });

    qr.toDataURL(strData, async function (err, code) {
      if (err) return console.log("error occurred");

      console.log("create candidate successfully");
      res.status(201).json({
        code,
      });
    });
  }),
  getQrCode: asyncHandle(async (req, res, next) => {
    const users = await User.find({ role: "candidate" });
    res.render("reader-qr", { users: users });
  }),
};
