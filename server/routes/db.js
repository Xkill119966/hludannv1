const mongoose = require("mongoose");

module.exports = function(MONGO_URI) {
	// initializing Fawn for future multiple transactions

	mongoose.set("useFindAndModify", false);
	mongoose.set("useCreateIndex", true);
	// database connecting....
	console.log("mongo", MONGO_URI);
	mongoose
		.connect(MONGO_URI || "mongodb://localhost:27017/hludann", {
			useNewUrlParser: true
		})
		.then(() => {
			console.log("mongoDB Running ");
		})
		.catch(err => {
			console.log("cannot connect to mongoDB");
		});
};
