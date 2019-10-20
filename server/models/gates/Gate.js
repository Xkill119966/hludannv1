const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const gateSchema = new Schema({
	name: {
		type: String
	},
	donations: [
		{
			donation_id: {
				type: mongoose.SchemaTypes.ObjectId,
				ref: "Donation"
				// autopopulate: true
			}
		}
	],

	bag_total: {
		type: Number,
		default: 0
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

	locations: [Number]

	//lat , long
});

gateSchema.plugin(require("mongoose-autopopulate"));

const Gate = mongoose.model("Gate", gateSchema);

module.exports = {
	Gate
};
