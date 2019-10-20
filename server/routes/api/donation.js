const express = require("express");
const router = express.Router();

const { authMiddleware } = require("../../middleware/auth");
const donorCtrl = require("../../controllers/donation");
router.post(`/create`, authMiddleware, donorCtrl.createDonation);
router.post(`/create/clothes`, authMiddleware, donorCtrl.createClothes);
router.get("/bydonor", authMiddleware, donorCtrl.getDonationByDonor);
router.post("/action", authMiddleware, donorCtrl.donationAction);
router.get("/:id", authMiddleware, donorCtrl.getDonationById);
router.delete("/:id", authMiddleware, donorCtrl.deleteDonation)


module.exports = router;
