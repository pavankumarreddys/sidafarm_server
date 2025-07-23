// routes/vehicleRoutes.js

const express = require('express');
const router = express.Router();
const validateToken = require('../middlewares/validateToken');
const { registerVehicle } = require('../controllers/vehicleController');

router.post('/register',validateToken, registerVehicle);

module.exports = router;
