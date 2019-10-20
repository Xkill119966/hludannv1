const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const distributionSchema = new Schema({
	local_id: {
		type: mongoose.SchemaTypes.ObjectId,
		ref: "Local",
		autopopulate: true
	},

	bag: {
		type: Number,
		default: 0
	},
	volunteer: {
		type: String
	},
	distributed_date: {
		type: Date
	}
});

distributionSchema.plugin(require("mongoose-autopopulate"));

const Distribution = mongoose.model("Distribution", distributionSchema);

module.exports = {
	Distribution
};
