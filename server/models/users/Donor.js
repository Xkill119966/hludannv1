const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const donorSchema = new Schema(
	{
		user_id: {
			type: mongoose.SchemaTypes.ObjectId,
			ref: "User",
			autopopulate: true
		}
	},
	{
		timestamps: true
	}
);

donorSchema.plugin(require("mongoose-autopopulate"));
const Donor = mongoose.model("Donor", donorSchema);
module.exports = {
	Donor
};
