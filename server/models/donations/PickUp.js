const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const pickUpSchema = new Schema({

    approxi_date: {
        type: Date
    },

    process: {
        type: String,
        enum: ["ENROUTE", "COMPLETE"]
    },

    traveller_id: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "Traveller",
        autopopulate: true
    },
    local_id: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "Local",
        autopopulate: true
    },
    bag: {
        type: Number
    }
})


pickUpSchema.plugin(require("mongoose-autopopulate"));

const PickUp = mongoose.model("PickUp", pickUpSchema);
module.exports = {
	PickUp
};
