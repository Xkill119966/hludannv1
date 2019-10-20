const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const travellerSchema = new Schema(
	{
		user_id: {
			type: mongoose.SchemaTypes.ObjectId,
			ref: "User",
			autopopulate: true
		},
		reward: {
			total: {
				type: Number,
				default: 0
			},
			locals: [{ type: mongoose.SchemaTypes.ObjectId, ref: "Local" }]
		}
	},
	{
		timestamps: true
	}
);

travellerSchema.plugin(require("mongoose-autopopulate"));

const Traveller = mongoose.model("Traveller", travellerSchema);
module.exports = {
	Traveller
};
