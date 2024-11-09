import React, { useEffect, useState, useRef } from 'react';
import { Modal } from 'react-bootstrap';
import { Map, Marker } from 'pigeon-maps';

const OrdersList = () => {
    const [orders, setOrders] = useState([]);
    const [error, setError] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [isRideAccepted, setIsRideAccepted] = useState(false);
    const [elapsedTime, setElapsedTime] = useState(0); // In seconds
    const timerRef = useRef(null); // Use useRef to hold timer reference
    const fetchOrders = async () => {
        try {
            const res = await fetch('http://localhost:3001/orders', {
                method: 'GET',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
    
            if (!res.ok) {
                throw new Error('Failed to fetch orders');
            }
    
            const data = await res.json();
            console.log("Fetched orders:", data);
            setOrders(data); // Update state with fetched orders
        } catch (err) {
            setError(err.message);
        }
    };

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const res = await fetch('http://localhost:3001/orders', {
                    method: 'GET',
                    credentials: 'include',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });

                if (!res.ok) {
                    throw new Error('Failed to fetch orders');
                }

                const data = await res.json();
                console.log("Fetched orders:", data);
                setOrders(data);
            } catch (err) {
                setError(err.message);
            }
        };

        fetchOrders();
    }, []);

    const handleShowModal = (order) => {
        setSelectedOrder(order);
        setShowModal(true);
        setIsRideAccepted(false); // Reset ride acceptance state
        setElapsedTime(0); // Reset elapsed time
    };

    const handleCloseModal = () => {
        console.log("Closing modal...");
        setShowModal(false);
        setSelectedOrder(null);
        setIsRideAccepted(false);
        setElapsedTime(0);
        clearInterval(timerRef.current);
    };

    const handleAcceptRide = async () => {
        try {
            const res = await fetch(`http://localhost:3001/orders/${selectedOrder._id}/start`, {
                method: 'PUT',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!res.ok) {
                throw new Error('Failed to start the ride');
            }

            const updatedOrder = await res.json();
            console.log("Ride started:", updatedOrder);
            setIsRideAccepted(true);
            setElapsedTime(0); // Reset timer
            startTimer();
        } catch (err) {
            setError(err.message);
        }
    };

    const handleEndRide = async () => {
        try {
            const res = await fetch(`http://localhost:3001/orders/${selectedOrder._id}/end`, {
                method: 'PUT',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
    
            if (!res.ok) {
                throw new Error('Failed to end the ride');
            }
    
            const updatedOrder = await res.json();
            console.log("Ride ended:", updatedOrder);
            
            // Close modal after ending the ride
            setIsRideAccepted(false);
            clearInterval(timerRef.current); // Stop the timer
            setElapsedTime(0); // Reset elapsed time
            
            // Ensure the modal closes and the selected order resets
            handleCloseModal();
            
            // Fetch the updated list of orders to reflect changes
            await fetchOrders(); // Make sure this function is defined to refresh orders
        } catch (err) {
            setError(err.message);
        }
    };

    const startTimer = () => {
        timerRef.current = setInterval(() => {
            setElapsedTime(prev => prev + 1);
        }, 1000);
    };

    const renderTable = () => (
        <div className="table-responsive mt-5">
            <h3>All Orders</h3>
            <table className="table table-striped table-bordered">
                <thead className="thead-dark">
                    <tr>
                        <th scope="col">Customer Email</th>
                        <th scope="col">Customer Username</th>
                        <th scope="col">Price</th>
                        <th scope="col">Distance</th>
                        <th scope="col">Status</th>
                    </tr>
                </thead>
                <tbody>
                    {orders.map(order => (
                        <tr key={order._id} onClick={() => handleShowModal(order)} style={{ cursor: 'pointer' }}>
                            <td>{order.customer?.email || 'N/A'}</td>
                            <td>{order.customer?.username ? order.customer?.username : 'Not Assigned'}</td>
                            <td>${order.price.toFixed(2)}</td>
                            <td>{order.distance.toFixed(2)} km</td>
                            <td>{order.status}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );

    const renderMapModal = () => {
        if (!selectedOrder || selectedOrder.locations.length < 2) return null;

        const [startLocation, endLocation] = selectedOrder.locations;

        return (
            <Modal show={showModal} onHide={handleCloseModal} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>Order Locations</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Map
                        center={[startLocation[0] + (endLocation[0] - startLocation[0]) / 2, startLocation[1] + (endLocation[1] - startLocation[1]) / 2]}
                        zoom={12}
                        height={500}
                    >
                        <Marker anchor={startLocation} color="green" />
                        <Marker anchor={endLocation} color="red" />
                    </Map>
                    <div className="mt-3">
                        {isRideAccepted ? (
                            <div>
                                <h5>Ride Accepted</h5>
                                <p>Elapsed Time: {elapsedTime} seconds</p>
                                <button className="btn btn-danger" onClick={handleEndRide}>End Ride</button>
                            </div>
                        ) : (
                            <div>
                                <h5>Accept this Ride</h5>
                                <button className="btn btn-success" onClick={handleAcceptRide}>Accept Ride</button>
                            </div>
                        )}
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <button
                        className="btn btn-secondary"
                        onClick={handleCloseModal}
                        disabled={isRideAccepted} // Disable close button if ride is accepted
                    >
                        Close
                    </button>
                </Modal.Footer>
            </Modal>
        );
    };

    return (
        <div className="container mt-5">
            {error && <div className="alert alert-danger">{error}</div>}
            {renderTable()}
            {renderMapModal()}
        </div>
    );
};

export default OrdersList;
