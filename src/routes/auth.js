const express = require("express");
let AuthController = require("../controllers/authentication/authentication");
let { userAuth } = require("../middleware/auth");
const router = express.Router();


router.post("/register", AuthController.registerUser);
router.post("/login", AuthController.loginUser);
router.post("/change-password", userAuth, AuthController.updatePassword);
router.post("/forget-password", AuthController.forgetPassword);
router.post("/reset-password", userAuth, AuthController.resetPassword);


module.exports = router;
