const User = require("../models/User");
const asyncHandle = require("../untils/asyncHandle");
const qr = require("qrcode");

module.exports = {
  getUsers: asyncHandle(async (req, res, next) => {}),
  createUserQr: asyncHandle(async (req, res, next) => {
    let strData = JSON.stringify(req.body);

    qr.toString(strData, { type: "terminal" }, function (err, code) {
      if (err) return console.log("erropzr occurred");
      // console.log(code);
    });

    qr.toDataURL(strData, async function (err, code) {
      if (err) return console.log("error occurred");

      console.log("create candidate successfully");
      res.render("qr", {
        src: code,
      });
    });
  }),
  getQrCode: asyncHandle(async (req, res, next) => {
    const users = await User.find({ role: "candidate" });
    res.render("reader-qr", { users: users });
  }),
};
