const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const clothingSchema = new Schema(
	{
		category: {
			type: String,
			enum: ["WOMEN", "MEN", "CHILDREN"]
		},
		type: {
			type: String,
			enum: [
				"SHIRT",
				"PANT",
				"HAT",
				"SHORT",
				"SHOE",
				"SKIRT",
				"TROUSER",
				"OTHER"
			]
		},
		qty: {
			type: Number,
			default: 0
		}
	},
	{
		timestamps: true
	}
);


clothingSchema.plugin(require("mongoose-autopopulate"));


const Clothing = mongoose.model("Clothing", clothingSchema);
module.exports = {
	Clothing
	
};
