// routes/vehicleRoutes.js

const express = require('express');
const router = express.Router();
const validateToken = require('../middlewares/validateToken');
const { registerVehicle, getAllVehicles, getVehicleById } = require('../controllers/vehicleController');

router.post('/register',validateToken, registerVehicle);
router.get('/getAllVehicles', validateToken,getAllVehicles);
router.get('/getVehicleById/:id', validateToken,getVehicleById);

module.exports = router;
