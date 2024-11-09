// components/AdminOrders.js
import React, { useEffect, useState,useContext } from 'react';
import { UserContext } from '../userContext';

const OrdersList = () => {
    const [orders, setOrders] = useState([]);
    const [error, setError] = useState('');
    const userContext = useContext(UserContext); 

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                //const token = localStorage.getItem('token');
                //console.log("token:", token);
                const res = await fetch('http://localhost:3001/orders', {
                    method: 'GET',
                    credentials: 'include',
                    headers: {
                        //'Authorization': `Bearer ${token}`
                         'Content-Type': 'application/json' 
                    }
                });

                if (!res.ok) {
                    throw new Error('Failed to fetch orders');
                }

                const data = await res.json();
                console.log("dateki",data)
                setOrders(data);
            } catch (err) {
                setError(err.message);
            }
        };

        fetchOrders();
    }, []);

    const handleStatusChange = async (orderId, newStatus) => {
        try {
            const res = await fetch(`http://localhost:3001/orders/${orderId}`, {
                method: 'PUT',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ status: newStatus })
            });

            if (!res.ok) {
                throw new Error('Failed to update order status');
            }

            const updatedOrder = await res.json();

            // Update the order status locally
            setOrders(prevOrders =>
                prevOrders.map(order =>
                    order._id === orderId ? { ...order, status: newStatus } : order
                )
            );
        } catch (err) {
            setError(err.message);
        }
    };

    const renderTable = (orders, status) => (
        <div className="table-responsive mt-5" >
            <h3>{status.charAt(0).toUpperCase() + status.slice(1)} Orders</h3>
            <table className="table table-striped table-bordered">
                <thead className="thead-dark">
                    <tr>
                        <th scope="col">User email</th>
                        <th scope="col">Account Name</th>
                        <th scope="col">Server</th>
                        <th scope="col">Current Rank</th>
                        <th scope="col">Desired Rank</th>
                        <th scope="col">Price</th>
                        <th scope="col">Payout</th>
                        <th scope="col">Status</th>
                    </tr>
                </thead>
                <tbody>
                    {orders.filter(order => order.status === status).map(order => (
                        <tr key={order._id}>
                            <td>{order.customer.email}</td>
                            <td>{order.accountName}</td>
                            <td>{order.server}</td>
                            <td>{order.currentRank}</td>
                            <td>{order.desiredRank}</td>
                            <td>${order.price}</td>
                            <td>${(order.price * 0.33).toFixed(2)}</td>
                            <td>
                                <select
                                    className="form-select"
                                    value={order.status}
                                    onChange={(e) => handleStatusChange(order._id, e.target.value)}
                                >
                                    <option value="pending">Pending</option>
                                    <option value="in-progress">In-progress</option>
                                    <option value="completed">Completed</option>
                                </select>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );


    return (
        <div className="container mt-5">
        {error && <div className="alert alert-danger">{error}</div>}
        {renderTable(orders, 'pending')}
        {renderTable(orders, 'in-progress')}
        {renderTable(orders, 'completed')}
    </div>
    );
};

export default OrdersList;
