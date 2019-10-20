const { Donation } = require("../models/donations/Donation");
const { Donor } = require("../models/users/Donor");
const { Local } = require("../models/users/Local");
const { Traveller } = require("../models/users/Traveller");
const { Clothing } = require("../models/donations/Clothing");
const { Gate } = require("../models/gates/Gate");
const { PickUp } = require("../models/donations/PickUp");

class DonationService {
	async getDonationById(id) {
		let errors = {};

		return new Promise((resolve, reject) => {
			Donation.findById(id, (err, data) => {
				if (err) {
					console.log(err);

					errors.findById = "no such with that Id";
					reject(errors);
				} else {
					resolve(data);
				}
			});
		});
	}

	//Create Donation
	async createDonation(data) {
		const { items, images, gate_id, donor_id } = data;
		const bag = {
			total: items.length || 0,
			items,
			images
		};
		let errors = {};

		return new Promise((resolve, reject) => {
			const newDonation = new Donation({
				gate_id: gate_id,
				donor_id: donor_id,
				bag: bag
			});

			newDonation.save((err, donation) => {
				if (err) {
					errors.createDonation = " err in save donation";
					reject(errors);
				} else {
					Gate.findOneAndUpdate(
						{ _id: gate_id },
						{
							$push: { donations: { donation_id: donation._id } },
							$inc: { bag_total: bag.total }
						},
						{ new: true, upsert: true },

						(err, docs) => {
							if (err) {
								console.log(docs);

								errors.findOneAndUpdate = " Gate findOneAndUpdate in error";
								reject(errors);
							} else {
								resolve(docs);
							}
						}
					);
				}
			});
		});
	}
	//Create Cloth
	async createCloth(data) {
		let { category, type, qty } = data;
		const newClothes = new Clothing({
			category: category,
			type: type,
			qty: qty
		});
		let errors = {};
		return new Promise((resolve, reject) => {
			newClothes.save((err, clothes) => {
				if (err) {
					errors.createCloth = "error in createCloth";
					reject(errors);
				} else {
					resolve(clothes);
				}
			});
		});
	}

	async getDonationByDonor(user_id) {
		let errors = {};
		let donor = await Donor.findOne({ user_id: user_id });
		console.log(donor);

		return new Promise((resolve, reject) => {
			Donation.find({ donor_id: donor._id }, (err, data) => {
				if (err) {
					errors.getDonationByDonor = "error in getDonationByDonor ";
					reject(errors);
				} else {
					let donationData = data.map(item => {
						return {
							_id: item._id,
							gate_name: item.gate_id.name,
							total: item.bag.total
						};
					});

					resolve(donationData);
				}
			});
		});
	}

	async donationAction(type, user_id, data) {
		let errors = {};
		let { _id, approxi_date, region, township, _local } = data;

		return new Promise((resolve, reject) => {
			switch (type) {
				case "REQUEST":
					let updateRequest = {
						process: "PENDING",
						"destination.approxi_date": approxi_date,
						"destination.region": region,
						"destination.township": township,
						"involved.local": _local,
						"involved.traveller_id": user_id
					};
					Donation.findOneAndUpdate(
						{ _id: _id },
						{
							$set: updateRequest
						},
						{ new: true, upsert: true },

						(err, updated) => {
							if (err) {
								errors.action = "donation process is error";
								reject(errors);
							} else {
								resolve(true);
							}
						}
					);

					break;
				case "ACCEPT":
					Donation.findOneAndUpdate(
						{ _id: _id },
						{
							$set: {
								process: "ENROUTE"
							}
						},
						{ new: true, upsert: true },

						(err, updated) => {
							if (err) {
								errors.action = "donation process is error";
								reject(errors);
							} else {
								resolve(true);
							}
						}
					);
					break;
				case "REJECT":
					Donation.findOneAndUpdate(
						{ _id: _id },
						{
							$set: {
								process: "OPEN"
							}
						},
						{ new: true, upsert: true },

						(err, updated) => {
							if (err) {
								errors.action = "donation process is error";
								reject(errors);
							} else {
								resolve(true);
							}
						}
					);
					break;
				case "COMPLETED":
					Donation.findOneAndUpdate(
						{ _id: _id },
						{
							$set: {
								process: "OPEN"
							}
						},
						{ new: true, upsert: true },

						(err, data) => {
							if (err) {
								errors.action = "donation process is error";
								reject(errors);
							} else {
								resolve(true);
							}
						}
					);
					break;
				default:
					break;
			}
		});
	}

	async deleteDonation(id) {
		let errors = {};
		return new Promise((resolve, reject) => {
			Donation.findByIdAndRemove(id, { process: "OPEN" }, (err, docs) => {
				if (err) {
					errors.deleteDonation = "error in deleteDonation";
					reject(errors);
				} else {
					resolve(docs);
				}
			});
		});
	}

	async pickUpDontaion(data, user_id) {
		let errors = {};
		let { local, bag, approxi_date } = data;
		let traveller = await Traveller.findOne({ user_id: user_id });

		let local_receiver;
		return new Promise((resolve, reject) => {
			const newPickUp = new PickUp({
				traveller_id: traveller._id,
				local_id: local,
				bag: bag,
				approxi_date: approxi_date,
				process: "ENROUTE"
			});

			newPickUp.save((err, docs) => {
				if (err) {
					console.log(err);

					errors.pickUpDontaion = "error in pickUpDontaion";
					reject(errors);
				} else {
					console.log("docs", docs);
					resolve(docs);
				}
			});
		});
	}

	async getPickUpByLocal(type, user_id) {
		let errors = {};
		
		
		return new Promise((resolve, reject) => {
			PickUp.find(
				{
					process: type 

				}, (err, docs) => {
					if (err) {
						errors.getPickUp = "error in getPickUp";
						reject(errors);
					} else {
						resolve(docs);
					}
				});
		});
	}

	async completePickUp(id) {
		let errors = {};
		return new Promise((resolve, reject) => {
			PickUp.findOneAndUpdate(
				{ _id: id },
				{ $set: { process: "COMPLETE" } },
				(err, docs) => {
					if (err) {
						errors.completeDonation = "error in completeDonation";
						reject(errors);
					} else {
						resolve(docs);
					}
				}
			);
		});
	}
}

module.exports = new DonationService();
