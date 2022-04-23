const User = require("../models/User");
const asyncHandle = require("../untils/asyncHandle");
const qr = require("qrcode");

module.exports = {
  createUser: asyncHandle(async (req, res, next) => {
    console.log(req.body);
    const newUser = await User.create(req.body);

    let strData = JSON.stringify(newUser);

    qr.toString(strData, { type: "terminal" }, async function (err, code) {
      if (err) return console.log("erropzr occurred");
      newUser.qrCode = code;
      await newUser.save();
      console.log(code);
    });

    qr.toDataURL(strData, function (err, code) {
      if (err) return console.log("error occurred");

      // console.log(code);
    });

    res.json({ newUser });
  }),
};
