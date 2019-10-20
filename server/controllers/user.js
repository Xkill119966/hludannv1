const { validationResult } = require("express-validator");
const { User } = require("../models/users/User");
const { Donor } = require("../models/users/Donor");
const { Traveller } = require("../models/users/Traveller");
const { Local } = require("../models/users/Local");
const { getAccountkitData } = require("../misc/facebookAccountkit");
const UserService = require("../services/UserService");

const register = function(req, res) {
	//Register Type
	const userType = req.query.type;
	const errors = validationResult(req.body);
	if (!errors.isEmpty()) {
		return res.status(422).json({ errors: errors.array() });
	} else {
		UserService.register(req.body, userType)
			.then(token => {
				return res.status(200).send({ success: true, token });
			})
			.catch(err => {
				console.log("err", err);
				return res.status(422).send({
					err: err,
					success: false
				});
			});
	}
};

const login = function(req, res) {
	UserService.login(req.body)
		.then(({ token, user_type }) => {
			res.status(200).send({
				token,
				user_type,
				success: true
			});
		})
		.catch(err => {
			res.status(400).send({
				success: false,
				err: err
			});
		});
};

const auth = function(req, res) {
	const { type } = req.query;
	let user_id = req.user._id;
	UserService.auth({ type, user_id })
		.then(user => {
			return res.status(200).send({
				success: true,
				user
			});
		})
		.catch(err => {
			return res.status(400).send({
				success: false,
				err
			});
		});
};

const logout = function(req, res) {
	User.findOneAndUpdate(
		{ _id: req.user._id },
		{ token: "" },
		(err, updateUser) => {
			if (err) {
				return res.json({ success: false, err });
			}
			return res.status(200).send({
				success: true
			});
			console.log("success");
		}
	);
};
const updateUserInfo = (req, res) => {
	const { user_id, coordinates, region, township, line1 } = req.body;
	let address = {
		line1,
		township,
		region
	};
	UserService.updateUserInfo(req.body)
		.then(success => {
			res.status(200).send({
				success
			});
		})
		.catch(err => {
			res.status(500).send({
				err,
				success: false
			});
		});
};
const updateUserInfoLocal = (req, res) => {
	UserService.updateUserInfo(req.body)
		.then(success => {
			res.status(200).send({
				success
			});
		})
		.catch(err => {
			res.status(500).send({
				err,
				success: false
			});
		});
};

const getLocals = async (req, res) => {
	const locals = await Local.find({});

	try {
		res.status(200).send({
			success: true,
			locals
		});
	} catch (err) {
		res.status(500).send({
			err,
			success: false
		});
	}
};

module.exports = {
	logout,
	updateUserInfo,
	updateUserInfoLocal,
	auth,
	register,
	login,
	getLocals
};
