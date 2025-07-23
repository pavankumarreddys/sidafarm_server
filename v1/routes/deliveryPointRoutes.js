const express = require('express');
const router = express.Router();
const {
  createDeliveryPoint,
  getAllDeliveryPoints,
  updateDeliveryPoint,
  deleteDeliveryPoint,
  getDeliveryPointById,
} = require('../controllers/deliveryPointController');
const validateToken = require('../middlewares/validateToken');

// Routes
router.post('/createDeliveryPoint', validateToken, createDeliveryPoint);
router.get('/getAllDeliveryPoints', validateToken,getAllDeliveryPoints);
router.get('/getDeliveryPointById/:id', validateToken,getDeliveryPointById);
router.put('/updateDeliveryPoint/:id', validateToken, updateDeliveryPoint);
router.delete('/deleteDeliveryPoint/:id',validateToken, deleteDeliveryPoint);

module.exports = router;
