var OrderModel = require('../models/orderModel.js');
var UserModel = require('../models/userModel.js');

/**
 * orderController.js
 *
 * @description :: Server-side logic for managing orders.
 */
module.exports = {

    /**
     * orderController.list()
     */
    list: function (req, res) {
        
        UserModel.findById(req.session.userId).exec(function (error, user) {
            if (error) {
                return res.status(500).json({
                    message: 'Error when identifying user.',
                    error: error
                });
            } 
            
            if (!user) {
                return res.status(401).json({
                    message: 'Not authorized, go back!'
                });
            } 
            
            // Define a filter for pending orders
            const pendingFilter = { status: 'Pending' };
    
            if (user.isAdmin) {
                // If the user is an admin, return all pending orders
                OrderModel.find(pendingFilter)
                    .populate('customer driver') // Populate customer and driver fields
                    .exec(function (err, orders) {
                        if (err) {
                            return res.status(500).json({
                                message: 'Error when getting orders.',
                                error: err
                            });
                        }
                        return res.json(orders);
                    });
            } else {
                // If the user is not an admin, return only their pending orders
                OrderModel.find({ ...pendingFilter, customer: req.session.userId })
                    .populate('driver') // Populate only driver for non-admin users
                    .exec(function (err, orders) {
                        if (err) {
                            return res.status(500).json({
                                message: 'Error when getting orders.',
                                error: err
                            });
                        }
                        return res.json(orders);
                    });
            }
        });
    },
    

    /**
     * orderController.create()
     * Create a new order.
     */
    create: function (req, res) {
        const { locations, price, distance, userId } = req.body;
        console.log("asd")

        // Validate input
        if (!locations || !price || !distance || !userId) {
            return res.status(400).json({
                message: 'Missing required fields'
            });
        }
        console.log("session",req )

        const order = new OrderModel({
            customer: userId,
            driver: null, // Initially set driver to null
            locations: locations, // Store locations as an array
            price: price,
            distance: distance,
        });
        console.log(order)
        order.save(function (err, savedOrder) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when creating order',
                    error: err
                });
            }

            return res.status(201).json(savedOrder);
        });
    },

    startDrive: async function (req, res) {
        const { orderId } = req.params;
        

        try {
            const order = await OrderModel.findById(orderId);

            if (!order) {
                return res.status(404).json({ message: 'Order not found' });
            }
            // Check if the order status is appropriate to start the drive
            
            


            // Update the order status to 'In Progress'
            order.status = 'In Progress';
            await order.save();

            return res.status(200).json({ message: 'Drive started successfully', order });
        } catch (err) {
            console.error(err);
            return res.status(500).json({ message: 'Error starting drive', error: err });
        }
    },

    /**
     * orderController.endDrive()
     * End the drive for an order.
     */
    endDrive: async function (req, res) {
        const { orderId } = req.params;
        

        try {
            const order = await OrderModel.findById(orderId);

            if (!order) {
                return res.status(404).json({ message: 'Order not found' });
            }

            // Check if the order status is appropriate to end the drive
            if (order.status !== 'In Progress') {
                return res.status(400).json({ message: 'Drive can only be ended for ongoing orders' });
            }

            // Update the order status to 'Completed'
            order.status = 'Completed';
            order.driver = req.session.userId;
            await order.save();

            return res.status(200).json({ message: 'Drive ended successfully', order });
        } catch (err) {
            console.error(err);
            return res.status(500).json({ message: 'Error ending drive', error: err });
        }
    },
    getDriverEarnings: async function (req, res) {
        try {
            const driverId = req.session.userId;
    
            // Find all orders where the driver is the logged-in user and the status is 'Completed'
            const completedOrders = await OrderModel.find({ driver: driverId, status: 'Completed' });
    
            // Calculate the total earnings by summing the price of completed orders
            const totalEarnings = completedOrders.reduce((sum, order) => sum + order.price, 0);
    
            return res.status(200).json({ totalEarnings });
        } catch (err) {
            console.error(err);
            return res.status(500).json({ message: 'Error retrieving driver earnings', error: err });
        }
    },
};
