const express = require("express");
const { check, body } = require("express-validator");
const router = express.Router();
const {
	register,
	login,
	auth,
	logout,
	updateUserInfo,
	updateUserInfoLocal,
	getLocals
} = require("../../controllers/user");
const { authMiddleware } = require("../../middleware/auth");
const { alreadyEmailValidation } = require("../../validations/users");
router.post("/updatelocal", authMiddleware, updateUserInfoLocal);
router.post("/update", authMiddleware, updateUserInfo);
router.post(
	"/register",
	[
		body("email")
			.isEmail()
			.custom((value, { req }) => {
				return alreadyEmailValidation(value);
			}),
		// password must be at least 5 chars long
		body("password").isLength({ min: 5 })
	],
	register
);
router.post(
	"/login",
	[
		//email must be an email
		body("email").isEmail(),
		// password must be at least 5 chars long
		body("password").isLength({ min: 4 })
	],
	login
);

router.get("/auth", authMiddleware, auth);
router.get("/logout", authMiddleware, logout);
router.get("/locals", getLocals);

module.exports = router;
