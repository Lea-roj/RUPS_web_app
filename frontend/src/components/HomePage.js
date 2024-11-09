import { useState, useEffect } from 'react';
import largeImage from './images/landingPageImg1.webp';
import './Photos.css';
import { useNavigate } from 'react-router-dom';

function HomePage(){
    const navigate = useNavigate();
    const [currentRank, setCurrentRank] = useState('');
    const [desiredRank, setDesiredRank] = useState('');
    const [price, setPrice] = useState(0);
    const rankPrices = {
        'Iron': 10,
        'Bronze': 15,
        'Silver': 20,
        'Gold': 30,
        'Platinum': 50,
        'Diamond': 90,
        'Master': 150,
        'Grandmaster': 400,
        'Challenger': 700
    };


        const calculatePrice = (current, desired) => {
            console.log("calcal")
            const ranks = Object.keys(rankPrices);
            const currentRankIndex = ranks.indexOf(currentRank);
            const desiredRankIndex = ranks.indexOf(desiredRank);
            console.log(currentRankIndex,desiredRankIndex)
            if (currentRankIndex === -1 || desiredRankIndex === -1 || desiredRankIndex <= currentRankIndex) {
                return 0;
            }
    
            let totalPrice = 0;
            for (let i = currentRankIndex+1; i <= desiredRankIndex; i++) {
                totalPrice += rankPrices[ranks[i]];
            }
    
            setPrice(totalPrice);
        };
    

    return(
        <div className="landing-page">
            <header className="jumbotron jumbotron-fluid bg-primary text-light text-center header-bg">
    <div className="container">
        <h1 className="display-4">Welcome to Your Take-Taxi Service</h1>
        <p className="lead">Get a reliable ride to your destination with just a few taps.</p>
        <hr className="my-4" />
        <p>Whether you're heading to work, the airport, or a night out, we're here to get you there safely and on time.</p>
        <button onClick={() => navigate('/publish')} className="btn btn-light btn-lg mt-3">Book a Ride Now</button>
    </div>
</header>


<section className="container py-5">
    <div className="row">
        <div className="col-md-4 mb-4">
            <div className="card">
                <div className="card-body">
                    <h2 className="card-title">Ride Services</h2>
                    <p className="card-text">Explore our reliable ride services that get you to your destination quickly and comfortably, anytime you need a lift.</p>
                </div>
            </div>
        </div>
        <div className="col-md-4 mb-4">
            <div className="card">
                <div className="card-body">
                    <h2 className="card-title">About Us</h2>
                    <p className="card-text">Learn more about our commitment to providing safe and convenient transportation options for everyone, everywhere.</p>
                </div>
            </div>
        </div>
        <div className="col-md-4 mb-4">
            <div className="card">
                <div className="card-body">
                    <h2 className="card-title">Customer Support</h2>
                    <p className="card-text">Need help with booking or have questions? Contact our dedicated support team, here to ensure a smooth and seamless ride experience.</p>
                </div>
            </div>
        </div>
    </div>
</section>


            

        </div>

    );
}

export default HomePage;