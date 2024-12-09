// frontend/src/components/LandingPage/LandingPage.jsx

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { getAllSpots } from "../../store/spots";
import { FaStar } from "react-icons/fa6";
import "./LandingPage.css";

function LandingPage() {
    const dispatch = useDispatch();
    // const state = useSelector((state) => state);
    const spots = useSelector((state) => Object.values(state.spots));

    useEffect(() => {
        dispatch(getAllSpots());
    }, [dispatch]);

    return (
        <div className="landing-page">
            <h1>Explore Spots</h1>
            <div className="spots-grid">
                {spots.map((spot) => (
                    <Link 
                        key={spot.id}
                        to={`/spots/${spot.id}`}
                        className="spot-tile"
                        title={spot.name}
                        data-tooltip={spot.name}
                    >
                        <img
                            src={spot.previewImage}
                            alt={spot.name}
                            className="spot-thumbnail"
                        />
                        <div className="spot-details">
                            <div className="city-state">
                                {spot.city}, {spot.state}
                            </div>
                            <div className="spot-name">
                                <p>{spot.name}</p>
                            </div>
                            <div className="spot-rating">
                                <div className="stars">
                                    <FaStar />
                                    {spot.avgRating || "NEW"}
                                </div>
                            </div>
                            <div className="spot-price">
                                ${spot.price} / night
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}

export default LandingPage;