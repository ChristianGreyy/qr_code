const express = require("express");
const userController = require("../controllers/userController");
const authController = require("../controllers/authController");

const router = express.Router();

router.get("/getUsers", userController.getUsers);
router.get("/qrCode", authController.protect, userController.getQrCode);
router.post("/createUserQR", userController.createUserQr);

module.exports = router;
