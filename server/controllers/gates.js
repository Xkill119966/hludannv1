const { Gate } = require("../models/gates/Gate");


const GateService = require('../services/GateService')

const getAllGates = (req, res) => {
    GateService.getAllGates().then(data => {
        res.status(200).send({
            gates: data,
            success: true
        });
    }).catch(err => {
        res.status(200).send({
            err,
            success: false
        });
    })
}

const createGate = (req, res) => {
    GateService.createGate(req.body).then(data => {
        res.status(200).send({
            gates: data,
            success: true
        })
    }).catch(err => {
        res.status(500).send({
            err,
            success: false
        })
    })
}



module.exports = {
    getAllGates,
    createGate
}