const express = require("express");
const router = express.Router();

const authController = require("../controller/authcontroller");

router.post("/", authController.login);

module.exports = router;
