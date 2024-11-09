import React, { useState, useContext } from 'react';
import { Navigate } from 'react-router';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Map, Marker } from "pigeon-maps";
import { UserContext } from "../userContext";

function AddOrder() {
    const [locations, setLocations] = useState([]); // Start with empty locations
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [price, setPrice] = useState(null); // State to store calculated price
    const [distance, setDistance] = useState(null); // State to store calculated distance
    const [error, setError] = useState(null); // State to store any error messages
    const userId = useContext(UserContext);
    const PRICE_PER_KM = 4; // Set your price per kilometer

    // Function to calculate the distance between two lat/lng points
    const calculateDistance = (coord1, coord2) => {
        const R = 6371; // Radius of the Earth in km
        const lat1 = coord1[0] * (Math.PI / 180); // Convert degrees to radians
        const lon1 = coord1[1] * (Math.PI / 180);
        const lat2 = coord2[0] * (Math.PI / 180);
        const lon2 = coord2[1] * (Math.PI / 180);

        const dLat = lat2 - lat1; // Difference in latitude
        const dLon = lon2 - lon1; // Difference in longitude

        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                  Math.cos(lat1) * Math.cos(lat2) *
                  Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        return R * c; // Distance in km
    };

    // Handle clicks on the map to add markers
    const handleMapClick = ({ latLng }) => {
        if (locations.length < 2) { // Limit to 2 markers (start and end)
            const newLocations = [...locations, latLng]; // Add new location
            setLocations(newLocations);
            if (newLocations.length === 2) {
                calculatePrice(newLocations); // Calculate price only when we have two locations
            }
        } else {
            setLocations([]); // Reset to empty locations
            setPrice(null); // Reset price
            setDistance(null); // Reset distance
        }
    };

    // Handle price calculation
    const calculatePrice = (newLocations) => {
        if (newLocations.length === 2) {
            const calculatedDistance = calculateDistance(newLocations[0], newLocations[1]);
            const calculatedPrice = calculatedDistance * PRICE_PER_KM; // Calculate price based on distance
            setPrice(calculatedPrice); // Update the price state
            setDistance(calculatedDistance); // Update the distance state
        }
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Prepare order data
        const orderData = {
            locations: locations,
            price: price,
            distance: distance,
            userId: userId.user._id
        };
        console.log(orderData)

        try {
            const response = await fetch('http://localhost:3001/orders/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(orderData)
            });

            if (!response.ok) {
                throw new Error('Error creating order');
            }

            // If the order is created successfully, set the submission state to true
            setIsSubmitted(true);
        } catch (err) {
            setError(err.message); // Set error message
        }
    };

    // Redirect after submission
    if (isSubmitted) {
        return <Navigate to="/" />;
    }

    return (
        <div className="container mt-5">
            <h2 className="mb-4">Order your Taxi ride.</h2>
            <form className="needs-validation" noValidate onSubmit={handleSubmit}>
                <Map
                    center={[46.5591, 15.6457]} // Center on Maribor
                    zoom={12}
                    height={500}
                    onClick={handleMapClick}
                >
                    {locations.map((location, index) => (
                        <Marker 
                            key={index} 
                            anchor={location} 
                            color={index === 0 ? "green" : "red"} // Color for first and second markers
                        />
                    ))}
                </Map>
                <button type="submit" className="btn btn-success mt-3">Create Order</button>
            </form>
            {error && <div className="alert alert-danger mt-3">{error}</div>}
            <div className="mt-3">
                {locations.length > 0 ? (
                    locations.map((location, index) => (
                        <div key={index}>
                            <strong>Marker {index + 1}:</strong> {`${location[0].toFixed(5)}, ${location[1].toFixed(5)}`}
                        </div>
                    ))
                ) : (
                    <div>No markers set.</div>
                )}
                {distance !== null && (
                    <div>
                        <strong>Distance:</strong> {distance.toFixed(2)} km
                    </div>
                )}
                {price !== null && (
                    <div>
                        <strong>Calculated Price:</strong> €{price.toFixed(2)}
                    </div>
                )}
            </div>
        </div>
    );
}

export default AddOrder;
