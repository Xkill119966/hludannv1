const { Distribution } = require("../models/Distribution");

class DistributionService {
	async createDistri(data) {
		return new Promise((resolve, reject) => {
			const { local_id, volunteer, bag, delivered_date } = data;
			const errors = {};
			const newDistribution = new Distribution({
				local_id,
				bag,
				distributed_date: delivered_date,
				volunteer
			});

			newDistribution.save((err, distribution) => {
				if (err) {
					errors.createDistri = "error in create distribution";
					reject(errors);
				} else {
					resolve(distribution);
				}
			});
		});
	}

	async getDistributions(local_id) {
		console.log("local", local_id);
		return new Promise((resolve, reject) => {
			const errors = {};

			Distribution.find({ local_id }, (err, distributions) => {
				if (err) {
					errors.getDistribution = "get distribution erorrs";
					reject(errors);
				} else {
					resolve(distributions);
				}
			});
		});
	}
}

module.exports = new DistributionService();
