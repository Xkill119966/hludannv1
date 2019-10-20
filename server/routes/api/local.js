const express = require("express");
const router = express.Router();
const localCtrl = require("../../controllers/local");
const { authMiddleware } = require("../../middleware/auth");
router.post("/distri", authMiddleware, localCtrl.createDistribution);
router.get("/distri/:id", authMiddleware, localCtrl.getDistributions);
module.exports = router;
