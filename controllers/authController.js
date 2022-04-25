const asyncHandle = require("../untils/asyncHandle");
const User = require("../models/User");
const ErrorResponse = require("../untils/ErrorResponse");
const jwt = require("jsonwebtoken");

const signToken = (id) => {
  return jwt.sign({ id }, process.env.TOKEN_SECRET, {
    expiresIn: process.env.TOKEN_EXPIRE,
  });
};

const createSendToken = (user, statusCode, res) => {
  // const cookieOptions = {
  //   expires: new Date(
  //     Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
  //   ),
  //   httpOnly: true,
  // };
  // res.cookie("tokens", token, cookieOptions);
  // if (process.env.NODE_ENV === "production") cookieOptions.secure = true;
  // res.status(statusCode).json({
  //   status: "success",
  //   token,
  //   data: {
  //     user,
  //   },
  // });
};

module.exports = {
  getLogin: asyncHandle(async (req, res, next) => {
    if (!req.session.token) {
      return res.render("login");
    }
    return res.redirect("/user/qrCode");
  }),
  login: asyncHandle(async (req, res, next) => {
    const { studentCode, password } = req.body;

    if (!studentCode || !password)
      return next(new ErrorResponse("Provide studentCode and password", 400));

    const user = await User.findOne({ studentCode }).select("+password");

    if (!user)
      return next(new ErrorResponse("Invaible studentCode or password", 404));

    // const isMatch = await user.isMatchPassword(password);
    const isMatch = user.password == password;
    console.log(isMatch);
    if (!isMatch) {
      return next(new ErrorResponse("Wrong password", 400));
    }

    const token = signToken(user.studentCode);

    req.session.token = token;

    res.redirect("/user/qrCode");

    // createSendToken(user, 200, res);
  }),
  protect: asyncHandle(async (req, res, next) => {
    let token = req.session.token;
    // console.log(token);

    if (!token) {
      return res.status(404).redirect("/auth/login");
      // return next(new Error("Cookie is not found", 404));
    }

    try {
      const payload = jwt.verify(token, process.env.TOKEN_SECRET);
      const user = await User.findOne({ studentCode: payload.id });

      if (!user) {
        // return next(new AppError("token is invaible"), 401);
        return res.status(401).redirect("/auth/login");
      }

      req.user = user;
      next();
    } catch (error) {
      console.log(error);
      return res.status(401).redirect("/auth/login");
      // return next(new ErrorResponse("token is invaible", 401));
    }
  }),
  retrictTo: (roles) => (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(new ErrorResponse("unauthorized", 401));
    }

    next();
  },
};
