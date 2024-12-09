import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import * as spotActions from "../../store/spots";
import './CreateSpot.css';

const CreateSpot = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    // Form Data
    const [address, setAddress] = useState("");
    const [city, setCity] = useState("");
    const [state, setState] = useState("");
    const [country, setCountry] = useState("");
    const [lat, setLat] = useState("");
    const [lng, setLng] = useState("");
    const [description, setDescription] = useState("");
    const [name, setName] = useState("");
    const [price, setPrice] = useState("");
    const [previewImage, setPreviewImage] = useState("");
    const [images, setImages] = useState(["", "", "", ""]);
    const [errors, setErrors] = useState({});
    const [imageErrors, setImageErrors] = useState({});

    // Form Submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        // setErrors({});
        const validationErrors = {};
        const validationImageErrors = {};

        // console.log("Form Data: ", {    address, city, state, country, latitude, longitude, description, name, price, previewImage, images    });

        // Validation
        if (!address) {
            validationErrors.address = "Address is required";
        }
        if (!city) {
            validationErrors.city = "City is required";
        }
        if (!state) {
            validationErrors.state = "State is required";
        }
        if (!country) {
            validationErrors.country = "Country is required";
        }
        if (lat && lat < -90 || lat > 90) {
            validationErrors.lat = "Latitude must be between -90 and 90";
        }
        if (lng && lng < -180 || lng > 180) {
            validationErrors.lng = "Longitude must be between -180 and 180";
        }
        if (!description || description.length < 30) {
            validationErrors.description = "Description needs 30 or more characters";
        }
        if (!name) {
            validationErrors.name = "Name is required";
        }
        if (!price) {
            validationErrors.price = "Price is required";
        }
        if (!previewImage) {
            validationImageErrors.previewImage = "Preview Image is required";
        }

        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        if (Object.keys(validationImageErrors).length > 0) {
            setImageErrors(validationImageErrors);
            return;
        }

        // console.log("Validation Errors: ", validationErrors);
        // console.log("Errors: ", errors);
        // setErrors(validationErrors);
        // console.log("Errors: ", errors);

        const spot = {
            name,
            description,
            address,
            city,
            state,
            country,
            price,
            lat: parseFloat(lat),
            lng: parseFloat(lng),
        }

        // const preview = {
        //     url: previewImage,
        //     preview: true,
        // }

        // const thumbnails = [
        //     {
        //         url: images[0],
        //         preview: false,
        //     },
        //     {
        //         url: images[1],
        //         preview: false,
        //     },
        //     {
        //         url: images[2],
        //         preview: false,
        //     },
        //     {
        //         url: images[3],
        //         preview: false,
        //     },
        // ]


        const newSpot = await dispatch(spotActions.createSpot(spot));
        // console.log("New Spot: ", newSpot);
        // console.log("New Spot ID: ", newSpot.Spot.id);

        // const newSpotImages = await dispatch(spotActions.createSpotImages(newSpot.Spot.id, preview, thumbnails));
        // console.log("New Spot Images: ", newSpotImages);

        if (newSpot && newSpot.Spot.id) {
            alert("Spot created successfully!");
            navigate(`/spots/${newSpot.Spot.id}`);
        } else {
            alert("Failed to create spot");
        }
    }

    return (
        <div className="new-spot">
            <h1>Create a New Spot</h1>
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
                <div className="fifth-section">
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
                <hr />
                <button 
                    type="submit"
                    disabled={!address || !city || !state || !country || !description || !name || !price || !previewImage || description.length < 30}
                    className="create-spot-button"
                >Create Spot</button>
            </form>
        </div>
    )
}

export default CreateSpot;