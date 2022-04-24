const express = require("express");
const userController = require("../controllers/userController");
const authController = require("../controllers/authController");

const router = express.Router();

router.get("/qrCode", userController.getQrCode);
router.post("/createUsers", userController.createUser);

module.exports = router;
