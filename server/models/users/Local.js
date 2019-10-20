const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const localSchema = new Schema(
	{
		user_id: {
			type: mongoose.SchemaTypes.ObjectId,
			ref: "User",
			autopopulate: true
		},

		approved: {
			type: Boolean,
			default: false
		},

		destination: {
			reward: {
				type: Number
			}
		}
	},
	{
		timestamps: true
	}
);


localSchema.plugin(require("mongoose-autopopulate"));

const Local = mongoose.model("Local", localSchema);
module.exports = {
	Local
};
