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
        console.log(req.session.userId);
        
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
            
            if (user.isAdmin) {
                // If the user is an admin, return all orders
                OrderModel.find()
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
                // If the user is not an admin, return only their orders
                OrderModel.find({ customer: req.session.userId })
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
    }
};
