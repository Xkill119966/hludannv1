const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { Clothing } = require("./Clothing");
const donationSchema = new Schema(
	{
		finished: {
			type: Boolean,
			default: false
		},

		donor_id: {
			type: mongoose.SchemaTypes.ObjectId,
			ref: "Donor",
			autopopulate: true
		},

		gate_id: {
			type: mongoose.SchemaTypes.ObjectId,
			ref: "Gate",
			autopopulate: true
		},

		bag: {
			total: {
				type: Number,
				default: 0
			},
			items: [
				{
					cloth_id: {
						type: mongoose.SchemaTypes.ObjectId,
						ref: "Clothing",
						autopopulate: true
					}
				}
			],
			images: [
				{
					url: {
						type: String
					},
					id: {
						type: String
					}
				}
			]
		}
	},
	{
		timestamps: true
	}
);

donationSchema.plugin(require("mongoose-autopopulate"));

const Donation = mongoose.model("Donation", donationSchema);
module.exports = {
	Donation
};
