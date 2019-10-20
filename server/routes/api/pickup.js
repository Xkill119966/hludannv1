const express = require("express");
const router = express.Router();
const { authMiddleware } = require("../../middleware/auth");
const donorCtrl = require("../../controllers/donation");

router.post("/create", authMiddleware, donorCtrl.pickUpDonation)

router.get('/', authMiddleware, donorCtrl.getPickUpByLocal)

router.post('/complete/:id', authMiddleware, donorCtrl.completePickUp)

module.exports = router;