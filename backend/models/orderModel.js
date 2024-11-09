const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
    customer: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true }, // Reference to the customer
    driver: { type: mongoose.Schema.Types.ObjectId, ref: 'user', default: null }, // Reference to the driver, default is null
    locations: [{ type: [Number], required: true }], // Array of locations [lat, lng]
    price: { type: Number, required: true }, // Calculated price for the order
    distance: { type: Number, required: true } // Distance for the trip in kilometers
});

// Create the Order model
const Order = mongoose.model('order', OrderSchema);

// Export the Order model
module.exports = Order;
