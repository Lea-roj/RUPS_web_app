const express = require('express');
const orderController = require('../controllers/orderController.js');
const router = express.Router();
//const adminAuth = require('../middleware/admin');

router.get('/', orderController.list);
router.post('/', orderController.create);


module.exports = router;
