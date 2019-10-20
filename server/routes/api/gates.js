const express = require("express");
const router = express.Router();
const GateCtrl = require('../../controllers/gates')

const { authMiddleware } = require("../../middleware/auth");
router.get('/', authMiddleware, GateCtrl.getAllGates)
router.post('/create', authMiddleware, GateCtrl.createGate)
module.exports = router;