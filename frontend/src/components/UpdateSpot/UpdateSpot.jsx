// frontend/src/components/UpdateSpot/UpdateSpot.jsx

import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import * as spotActions from '../../store/spots';
import './UpdateSpot.css';

const UpdateSpot = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { spotId } = useParams();
    
    const spot = useSelector((state) => state.spots[spotId]);

    const [address, setAddress] = useState("");
    const [city, setCity] = useState("");
    const [state, setState] = useState("");
    const [country, setCountry] = useState("");
    const [lat, setLat] = useState("");
    const [lng, setLng] = useState("");
    const [description, setDescription] = useState("");
    const [name, setName] = useState("");
    const [price, setPrice] = useState("");
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (spot) {
            setAddress(spot.address || "");
            setCity(spot.city || "");
            setState(spot.state || "");
            setCountry(spot.country || "");
            setLat(spot.lat || "");
            setLng(spot.lng || "");
            setDescription(spot.description || "");
            setName(spot.name || "");
            setPrice(spot.price || "");
        }
    }, [spot])

    const handleSubmit = async (e) => {
        e.preventDefault();

        const updatedSpot = {
            address,
            city,
            state,
            country,
            lat: parseFloat(lat),
            lng: parseFloat(lng),
            name,
            description,
            price: parseFloat(price),
        };

        const result = await dispatch(spotActions.updateSpot(spotId, updatedSpot));

        // console.log(result);

        if (result.errors) {
            setErrors(result.errors);
        } else {
            navigate(`/spots/${spotId}`);
        }
    }

    return (
        <div className="update-spot">
            <h1>Update Your Spot</h1>
            <form onSubmit={handleSubmit}>
            <div className="first-section">
                    <h2>Where&apos;s your place located?</h2>
                    <p>Guests will only get your exact address once they booked a reservation.</p>
                    <label className="address">
                        <input
                            type="text"
                            placeholder="Address"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            // required
                        />
                        {errors.address && <p className="errors">{errors.address}</p>}
                    </label>
                    <label className="city">
                        <input
                            type="text"
                            placeholder="City"
                            value={city}
                            onChange={(e) => setCity(e.target.value)}
                            // required
                        />
                        {errors.city && <p className="errors">{errors.city}</p>}
                    </label>
                    <label className="state">
                        <input
                            type="text"
                            placeholder="State"
                            value={state}
                            onChange={(e) => setState(e.target.value)}
                            // required
                        />
                        {errors.state && <p className="errors">{errors.state}</p>}
                    </label>
                    <label className="country">
                        <input
                            type="text"
                            placeholder="Country"
                            value={country}
                            onChange={(e) => setCountry(e.target.value)}
                            // required
                        />
                        {errors.country && <p className="errors">{errors.country}</p>}
                    </label>
                    <label className="latitude">
                        <input
                            type="text"
                            placeholder="Latitude"
                            value={lat}
                            onChange={(e) => setLat(e.target.value)}
                        />
                        {errors.lat && <p className="errors">{errors.lat}</p>}
                    </label>
                    <label className="longitude">
                        <input
                            type="text"
                            placeholder="Longitude"
                            value={lng}
                            onChange={(e) => setLng(e.target.value)}
                        />
                        {errors.lng && <p className="errors">{errors.lng}</p>}
                    </label>
                </div>
                <hr />
                <div className="second-section">
                    <h2>Describe your place to guests</h2>
                    <p>Mention the best features of your space, any special amenities like fast wifi or parking, and what you love about the neighborhood.</p>
                    <label className="description">
                        <input
                            type="text"
                            placeholder="Please write at least 30 characters"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            // required
                        />
                        {errors.description && <p className="errors">{errors.description}</p>}
                    </label>
                </div>
                <hr />
                <div className="third-section">
                    <h2>Create a title for your spot</h2>
                    <p>Catch guests&apos; attention with a spot title that highlights what makes your place special.</p>
                    <label className="name">
                        <input
                            type="text"
                            placeholder="Name of your spot"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            // required
                        />
                        {errors.name && <p className="errors">{errors.name}</p>}
                    </label>
                </div>
                <hr />
                <div className="fourth-section">
                    <h2>Set a base price for your spot</h2>
                    <p>Competitive pricing can help your listing stand out and rank higher in search results.</p>
                    <label className="price">
                        <input
                            type="number"
                            placeholder="Price per night (USD)"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                            // required
                        />
                        {errors.price && <p className="errors">{errors.price}</p>}
                    </label>
                </div>
                <hr />
                {/* <div className="fifth-section">
                    <h2>Liven up your spot with photos</h2>
                    <p>Submit a link to at least one photo to publish your spot.</p>
                    <label className="preview-image">
                        <input
                            type="text"
                            placeholder="Preview Image URL"
                            value={previewImage}
                            onChange={(e) => setPreviewImage(e.target.value)}
                            // required
                        />
                        {imageErrors.previewImage && <p className="errors">{imageErrors.previewImage}</p>}
                    </label>
                    {images.map((image, index) => (
                        <label key={index} className="image">
                            <input
                                type="text"
                                placeholder="Image URL"
                                value={image}
                                onChange={(e) => {
                                    const newImages = [...image];
                                    newImages[index] = e.target.value;
                                    setImages(newImages);
                                }}
                            />
                        </label>
                    ))}
                </div>
                <hr /> */}
                <button
                    type="submit"
                    disabled={!address || !city || !state || !country || !lat || !lng || !description || !name || !price}
                    className="update-spot-button"
                >Update your Spot</button>
            </form>
        </div>
    );
    // // console.log(spot);
    // // SOMETHING TO LEARN FROM THIS SNIPPET:
    // /*
    // The operator '?' is used to avoid errors when trying to access properties of an object that may be undefined. If the object is undefined, the expression will return undefined instead of throwing an error. This is useful when working with data that may be asynchronous and not yet available. In this case, the spot object is initially set to null and then updated with the spot data once it is fetched from the API. By using the '?' operator, we can safely access nested properties of the spot object without causing errors. 
    // */

    // const spotImages = spot?.SpotImages;

    // // console.log('SpotImages:', spotImages);
    
    // spotImages?.forEach((image) => {
    //     console.log(image?.url);
    //     console.log(image?.preview);
    // });
}

export default UpdateSpot;