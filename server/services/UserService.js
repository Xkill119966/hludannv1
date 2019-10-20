const { User } = require("../models/users/User");
const { Donor } = require("../models/users/Donor");
const { Traveller } = require("../models/users/Traveller");
const { Local } = require("../models/users/Local");

class UserService {
	async register(data, userType) {
		let { email, password, username, phone } = data;
		let errors = {};

		return new Promise((resolve, reject) => {
			let userNew = new User({
				username: username,
				email: email,
				password: password,
				phone: phone,
				user_type: userType
			});

			userNew.save((err, userDoc) => {
				if (err) {
					errors.register = "user register save error";
					reject(errors);
				} else {
					switch (userType) {
						case "DONOR":
							const donor = new Donor({
								user_id: userDoc._id
							});
							donor.save((err, donor) => {
								if (err) {
									console.log(err);
									errors.register = "donor save error";
									reject(errors);
								} else {
									userDoc.generateToken((err, user) => {
										if (err) {
											console.log(err);
											errors.register = "generate token error";
											reject(errors);
										} else {
											console.log("user", user);
											// FINAL RESPONSE
											console.log("success");
											resolve(user.token);
										}
									});
								}
							});

							break;
						case "TRAVELLER":
							const traveller = new Traveller({
								user_id: userDoc._id
							});

							traveller.save((err, traveller) => {
								if (err) {
									errors.register = "traveller save error";
									reject(errors);
								} else {
									userDoc.generateToken((err, user) => {
										if (err) {
											errors.register = "generate token error";
											reject(errors);
										} else {
											// FINAL RESPONSE
											resolve(user.token);
										}
									});
								}
							});
							break;
						case "LOCAL":
							const local = new Local({
								user_id: userDoc._id
							});
							local.save((err, local) => {
								if (err) {
									errors.register = "local save error";
									reject(errors);
								} else {
									userDoc.generateToken((err, user) => {
										if (err) {
											console.log("err");
											console.log("user", user);
											errors.register = "generate token error";
											reject(errors);
										} else {
											// FINAL RESPONSE
											resolve(user.token);
										}
									});
								}
							});
							break;
						default:
							break;
					}
				}
			});
		});
	}

	async login(data) {
		return new Promise((resolve, reject) => {
			let errors = {};
			User.findOne({ email: data.email }, (err, user) => {
				if (!user) {
					errors.login = "user not found";
					reject(errors);
				} else {
					user.comparePassword(data.password, (err, isMatch) => {
						if (!isMatch) {
							return res.json({
								loginSuccess: false,
								message: "Wrong password"
							});
						} else {
							user.generateToken((err, user) => {
								if (err) {
									errors.login = "errors in generate token";
									reject(errors);
								} else {
									resolve({
										token: user.token,
										user_type: user.user_type
									});
								}
							});
						}
					});
				}
			});
		});
	}

	async auth({ type, user_id }) {
		return new Promise((resolve, reject) => {
			let errors = {};
			switch (type) {
				case "TRAVELLER":
					Traveller.findOne({
						user_id
					})
						.populate("user_id")
						.then(traveller => {
							resolve(traveller);
						})
						.catch(err => {
							errors.auth = "auth error traveller";
							reject(errors);
						});
					break;
				case "LOCAL":
					Local.findOne({
						user_id
					})
						.populate("user_id")
						.then(local => {
							resolve(local);
						})
						.catch(err => {
							errors.auth = "auth error local";
							reject(errors);
						});
					break;
				case "DONOR":
					Donor.findOne({
						user_id
					})
						.populate("user_id")
						.then(donor => {
							resolve(donor);
						})
						.catch(err => {
							errors.auth = "auth error donor";
							reject(errors);
						});
					break;

				default:
					break;
			}
		});
	}
	async updateUserInfo(data) {
		const {
			user_id,
			coordinates,
			region,
			township,
			line1,
			nrc = "no_nrc"
		} = data;
		let address = {
			line1,
			township,
			region
		};
		let errors = {};

		return new Promise((resolve, reject) => {
			User.findOneAndUpdate(
				{ _id: user_id },
				{
					$set: {
						location: {
							type: "Point",
							coordinates: coordinates
						},
						address: address,
						nrc: nrc
					}
				},
				{ new: true, upsert: true },
				(err, updated) => {
					if (err) {
						errors.updateUserInfo = "update user info error";
						reject(errors);
					} else {
						resolve(true);
					}
				}
			);
		});
	}
	async updateUserInfoLocal(data) {
		const { user_id, region, township, line1, nrc = "no_nrc" } = data;
		let address = {
			line1,
			township,
			region
		};
		let errors = {};

		console.log(data);
		return new Promise((resolve, reject) => {
			User.findOneAndUpdate(
				{ _id: user_id },
				{
					$set: {
						address: address,
						nrc: nrc
					}
				},
				{ new: true, upsert: true },
				(err, updated) => {
					console.log("err", err);
					if (err) {
						errors.updateUserInfo = "update user info error";
						reject(errors);
					} else {
						resolve(true);
					}
				}
			);
		});
	}
}

module.exports = new UserService();
