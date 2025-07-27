//here we need to write functions for get all usrs and get userdatabyid 
const express = require('express');
const router = express.Router();
const validateToken = require('../middlewares/validateToken');
const { getAllUsers, getUserById, getCurrentUserByToken } = require('../controllers/userControllers');

router.get('/getallusers', validateToken, getAllUsers);
router.get('/getcurrentuserbytoken', validateToken, getCurrentUserByToken);
router.get('/getUserById/:id', validateToken, getUserById);
module.exports = router;