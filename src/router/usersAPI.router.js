const express = require("express");
const router = express.Router();

const userController = require("../controller/user.controller");

//------------------User---Api-------------------------------
router.post("/register", userController.register);

router.post("/login", userController.login);

router.post("/changePassword", userController.changePassword);

router.post("/delete", userController.deleteUser);
//-------------------------------------------------------------

module.exports = router;
