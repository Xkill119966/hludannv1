const { Donation } = require("../models/donations/Donation");
const { Clothing } = require("../models/donations/Clothing");
const { Donor } = require("../models/users/Donor");
const { Local } = require("../models/users/Local");
const { Traveller } = require("../models/users/Traveller");
const { PickUp } = require("../models/donations/PickUp");
const DonationService = require("../services/DonationService");

const getDonationById = (req, res) => {
	const { id } = req.params;
	DonationService.getDonationById(id)
		.then(donation => {
			res.status(200).send({
				donation: donation,
				success: true
			});
		})
		.catch(err => {
			res.status(500).send({
				err,
				success: false
			});
		});
};

const createDonation = (req, res) => {
	DonationService.createDonation(req.body)
		.then(donation => {
			res.status(200).send({
				donation,
				succcess: true
			});
		})
		.catch(err => {
			res.status(500).send({
				err,
				succcess: false
			});
		});
};

const getDonationByDonor = async (req, res) => {
	DonationService.getDonationByDonor(req.user._id)
		.then(donations => {
			res.status(200).send({
				donations: donations,
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

const createClothes = (req, res) => {
	DonationService.createCloth(req.body)
		.then(clothes => {
			res.status(200).send({
				clothes: clothes,
				succcess: true
			});
		})
		.catch(err => {
			console.log(err);

			res.status(500).send({
				err,
				succcess: false
			});
		});
};

const donationAction = async (req, res) => {
	let { type } = req.query;
	DonationService.donationAction(type, req.user._id, req.body)
		.then(data => {
			res.status(200).send({
				data: data,
				succcess: true
			});
		})
		.catch(err => {
			res.status(500).send({
				err,
				succcess: false
			});
		});
};

const deleteDonation = async (req, res) => {
	const { id } = req.params;
	DonationService.deleteDonation(id)
		.then(data => {
			res.status(200).send({
				succcess: true
			});
		})
		.catch(err => {
			res.status(200).send({
				err,
				succcess: false
			});
		});
};

const pickUpDonation = (req, res) => {
	DonationService.pickUpDontaion(req.body, req.user._id)
		.then(data => {
			res.status(200).send({
				data: data,
				succcess: true
			});
		})
		.catch(err => {
			console.log("err", err);
			res.status(500).send({
				err,
				succcess: false
			});
		});
};
const getPickUps = async (req, res) => {
	const { process } = req.query;

	PickUp.find({
		process
	})
		.then(pickups => {
			res.status(200).send({
				success: false,
				pickups
			});
		})
		.catch(err => {
			res.status(500).send({
				success: false,
				err: err
			});
		});
};

const completePickUp = (req, res) => {
	const { pickup_id } = req.body;
	PickUp.findOneAndUpdate(
		{ _id: pickup_id },
		{
			$set: {
				process: "COMPLETE"
			}
		},
		{ new: true },
		(err, pickup) => {}
	);
};
module.exports = {
	createDonation,
	createClothes,
	getDonationByDonor,
	getDonationById,
	donationAction,
	deleteDonation,
	pickUpDonation,
	getPickUps,
	completePickUp
};
