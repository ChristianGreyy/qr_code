const User = require("../models/User");
const asyncHandle = require("../untils/asyncHandle");
const qr = require("qrcode");

module.exports = {
  createUser: asyncHandle(async (req, res, next) => {
    const newUser = await User.create(req.body);

    let strData = JSON.stringify(newUser);

    qr.toString(strData, { type: "terminal" }, function (err, code) {
      if (err) return console.log("erropzr occurred");
      console.log(code);
    });

    qr.toDataURL(strData, async function (err, code) {
      if (err) return console.log("error occurred");
      newUser.qrCode = code;
      await newUser.save();
      console.log(code);

      console.log("create candidate successfully");
      res.render("qr", {
        user: newUser,
      });
    });
  }),
  getQrCode: asyncHandle(async (req, res, next) => {
    res.render("reader-qr");
  }),
};
