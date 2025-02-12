const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

// path: /auth/register
router.post("/register", authController.register);

// path: /auth/login
router.post("/login", authController.login);

module.exports = router;