const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const userSchema = new Schema({
	username: {
		type: String,
		minlength: 4,
		maxlength: 50
	},
	email: {
		type: String
	},
	phone: {
		type: Number
	},
	nrc: {
		type: Number
	},
	user_type: {
		type: String,
		enum: ["DONOR", "TRAVELLER", "LOCAL"]
	},
	password: {
		type: String
	},
	location: {
		type: {
			type: String,
			enum: ["Point"]
		},
		coordinates: {
			type: [Number]
		}
	},
	address: {
		line1: {
			type: String
		},
		township: {
			type: String
		},
		region: {
			type: String
		}
	},
	token: {
		type: String
	}
});

userSchema.pre("save", function(next) {
	var user = this;
	if (user.isModified("password")) {
		bcrypt.genSalt(10, function(err, salt) {
			if (err) return next(err);
			bcrypt.hash(user.password, salt, function(err, hash) {
				if (err) return next(err);
				user.password = hash;
				next();
			});
		});
	} else {
		next();
	}
});

// comparing password coming from req.body and if match , send isMatch value
userSchema.methods.comparePassword = function(candidatePassword, cb) {
	var user = this;
	bcrypt.compare(candidatePassword, user.password, function(err, isMatch) {
		if (err) return cb(err);
		cb(null, isMatch);
	});
};

// generating JWT token and set to specific user instance to use or send to client
userSchema.methods.generateToken = function(cb) {
	var user = this;
	var token = jwt.sign(user._id.toHexString(), "secret");
	user.token = token;
	user.save(function(err, user) {
		if (err) return cb(err);
		cb(null, user);
	});
};

// finding user by matching token

userSchema.statics.findByToken = function(token, cb) {
	var user = this;
	// verify token coming from request and compare with user's token
	// if match >> will receive decode >> find correct user by comparing _id with decode since we sign jwt as user._id
	jwt.verify(token, "secret", function(err, decode) {
		user.findOne({ _id: decode, token: token }, function(err, user) {
			if (err) return cb(err);
			cb(null, user);
		});
	});
};

const User = mongoose.model("User", userSchema);
module.exports = {
	User
};
