const { Gate } = require("../models/gates/Gate");

class GateService {
	async getAllGates() {
		let errors = {};
		return new Promise((resolve, reject) => {
			Gate.find({}, (err, docs) => {
				if (err) {
					errors.getAllGates = "error in getAllGates";
					reject(errors);
				} else {
					resolve(docs);
				}
			});
		});
	}

	async createGate(data) {
		let { name, location } = data;
		let errors = {};
		return new Promise((resolve, reject) => {
			const newgates = new Gate({
				name: name,
				locations: location
			});

			newgates.save((err, docs) => {
				if (err) {
					errors.createGate = "error in cerateGates";
					reject(errors);
				} else {
					resolve(docs);
				}
			});
		});
	}
}

module.exports = new GateService();
