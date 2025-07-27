// routes/vehicleRoutes.js

const express = require('express');
const router = express.Router();
const validateToken = require('../middlewares/validateToken');
const { createTrayLoading, getTodayTrayLoading, updateTrayLoadingById, getTrayLoadingbyId, getAllTrayLoadings } = require('../controllers/traysControllers');

router.post('/createTrayLoading',validateToken, createTrayLoading);
router.get('/getAllTrayLoadings',validateToken, getAllTrayLoadings);
router.get('/getTodayTrayLoading',validateToken, getTodayTrayLoading);
router.get('/getTrayLoadingbyId/:id',validateToken, getTrayLoadingbyId);
router.post('/updateTrayLoadingById/:id',validateToken, updateTrayLoadingById);



module.exports = router;
