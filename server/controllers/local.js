const DistributionService = require("../services/DistributionService");

const getDistributions = (req, res) => {
	const { id } = req.params;
	DistributionService.getDistributions(id)
		.then(distributions => {
			res.status(200).send({
				success: true,
				distributions
			});
		})
		.catch(err => {
			console.log("err", err);
			res.status(500).send({
				success: false,
				err
			});
		});
};
const createDistribution = (req, res) => {
	DistributionService.createDistri(req.body)
		.then(distribution => {
			res.status(200).send({
				distribution: distribution,
				success: true
			});
		})
		.catch(err => {
			res.status(500).send({
				success: false,
				err
			});
		});
};

module.exports = {
	createDistribution,
	getDistributions
};
