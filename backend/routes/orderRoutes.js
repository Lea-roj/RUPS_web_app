const express = require('express');
const orderController = require('../controllers/orderController.js');
const router = express.Router();
//const adminAuth = require('../middleware/admin');

router.get('/', orderController.list);
router.post('/', orderController.create);
router.put('/:orderId/start', orderController.startDrive);
router.put('/:orderId/end', orderController.endDrive);
router.get('/driver/earnings', orderController.getDriverEarnings);

module.exports = router;
