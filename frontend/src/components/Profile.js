import { useContext, useEffect, useState } from 'react';
import { UserContext } from '../userContext';
import { Navigate } from 'react-router-dom';
import Avatar from './images/Avatar.png';

function Profile(){
    const [orders, setOrders] = useState([]);
    const [error, setError] = useState('');
    const userContext = useContext(UserContext); 
    const [profile, setProfile] = useState({});
    const [totalPrice, setTotalPrice] = useState(0);
    


    useEffect(function(){
        let prof;
        const getProfile = async function(){
            const res = await fetch("http://localhost:3001/users/profile", {credentials: "include"});
            const data = await res.json();
            prof = data;
            console.log("prof", data)
            if(prof.isAdmin){
                
                    try {
                        const res = await fetch('http://localhost:3001/orders/driver/earnings', {
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
                        console.log("Earnings:", data);
                        setTotalPrice(Number(data.totalEarnings).toFixed(2));
                    } catch (err) {
                        setError(err.message);
                    }
                
            }
            setProfile(data);
        }
        getProfile();

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
                    {orders.filter(order => order.status === status && order.booster._id === profile._id).map(order => (
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
        <div className="container">

            {!userContext.user ? <Navigate replace to="/login" /> : ""}
            <div className="row justify-content-center mt-5">
                <div className="col-lg-6">
                    <div className="card">
                        <div className="card-body">
                            <h1 className="card-title text-center mb-4">User Profile</h1>
                            <div className="text-center mb-4">
                                <img src={Avatar} alt="Profile Avatar" className="rounded-circle" style={{ width: "150px", height: "150px" }} />
                            </div>
                            <div className="profile-details mb-4 text-center">
                                <p className="mb-1"><strong>Username:</strong> {profile.username}</p>
                                <p className="mb-1"><strong>Email:</strong> {profile.email}</p>
                                {profile.isAdmin && <p className="mb-1"><strong>Total money earned:</strong> ${totalPrice}</p>}

                            </div>
                        </div>
                    </div>
                </div>
            </div>


        </div>
    );
}

export default Profile;