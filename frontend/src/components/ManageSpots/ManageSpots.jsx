// frontend/src/components/ManageSpots/ManageSpots.jsx

import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import * as spotActions from '../../store/spots';
import OpenModalButton from '../OpenModalButton/OpenModalButton';
import DeleteSpotModal from '../DeleteSpotModal/DeleteSpotModal';
import './ManageSpots.css';

const ManageSpots = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const user = useSelector((state) => state.session.user);
    const spots = useSelector((state) => Object.values(state.spots));

    useEffect(() => {
        dispatch(spotActions.getAllSpots());
    }, [dispatch]);

    if (!user) {
        return navigate("/", {
            state: { message: "You must be logged in to view this page" },
            replace: true
        });
    }

    const allSpots = spots.filter((spot) => spot.ownerId === user.id);

    const noSpots = () => {
        if (allSpots.length === 0) {
            return (
                <div className="no-spots">
                    <h2>You have not created any spots yet.</h2>
                    <Link to="/spots/new" className="create-spot-link">Create a spot</Link>
                </div>
            )
        }
    }

    return (
        <>
            <div className="manage-spots">
                <h1>Manage Your Spots</h1>
                {noSpots()}
                {/* <Link to="/spots/new" className="create-spot-link">Create Spot</Link> */}
                <div className="manage-spots-grid">
                    {allSpots.map((spot) => (
                        <div className="tile-and-buttons" key={spot.id}>
                            <Link
                                key={spot.id}
                                to={`/spots/${spot.id}`}
                                className="manage-spot-tile"
                                title={spot.name}
                            >
                                <img
                                    src={spot.previewImage}
                                    alt={spot.name}
                                    className="manage-spot-thumbnail"
                                />
                                <div className="manage-spot-details">
                                    <div className="manage-city-state">
                                        {spot.city}, {spot.state}
                                    </div>
                                    <div className="manage-spot-name">
                                        {spot.name}
                                    </div>
                                    <div className="manage-spot-rating">
                                        <div className="stars">
                                            {spot.rating || "NEW"}
                                        </div>
                                    </div>
                                    <div className="manage-spot-price">
                                        ${spot.price} / night
                                    </div>
                                </div>
                            </Link>
                            <div className="manage-spot-buttons">
                                <button
                                    className="manage-edit-button"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        navigate(`/spots/${spot.id}/edit`);
                                    }}
                                >Update</button>
                                <OpenModalButton
                                    buttonText="Delete"
                                    modalComponent={<DeleteSpotModal spot={spot} />}
                                    className="manage-delete-spot"
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
}

export default ManageSpots;