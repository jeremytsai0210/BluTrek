// frontend/src/components/LandingPage/LandingPage.jsx

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllSpots } from "../../store/spots";
import "./LandingPage.css";

function LandingPage() {
    const dispatch = useDispatch();
    const state = useSelector((state) => state);
    const spots = useSelector((state) => Object.values(state.spots));

    return (
        <div>
        <h1>Landing Page</h1>
        </div>
    );
}

export default LandingPage;