// frontend/src/components/SpotDetail/SpotDetail.jsx

import { useEffect, useState } from "react";
import { /* useDispatch, */ useSelector } from "react-redux";
import { useParams } from "react-router-dom";
// import * as spotActions from "../../store/spots";
// import * as reviewActions from "../../store/reviews";
import OpenModalButton from "../OpenModalButton/OpenModalButton";
import ReviewModal from "../ReviewModal/ReviewModal";
import DeleteReviewModal from "../DeleteReviewModal/DeleteReviewModal";
import './SpotDetail.css';

function SpotDetail() {
    // const dispatch = useDispatch();
    const { spotId } = useParams();
    const [spot, setSpot] = useState(null);
    const [reviews, setReviews] = useState([]);
    // const [hasReviewed, setHasReviewed] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [rating, setRating] = useState(null);

    const user = useSelector((state) => state.session.user);

    const onChange = (newRating) => {
        setRating(newRating);
    }

    // months object for review dates
    const months = {
        1: "January",
        2: "February",
        3: "March",
        4: "April",
        5: "May",
        6: "June",
        7: "July",
        8: "August",
        9: "September",
        10: "October",
        11: "November",
        12: "December"
    }

    useEffect(() => {
        const fetchSpot = async () => {
            const spot = await fetch(`/api/spots/${spotId}`);
            const spotData = await spot.json();
            setSpot(spotData);
            // console.log(spotData);

            const review = await fetch(`/api/spots/${spotId}/reviews`);
            const reviewData = await review.json();
            setReviews(reviewData.Reviews);
            // console.log(reviewData);

            // const userReview = reviewData.Reviews.find((review) => review.User.id === user.id);
            // setHasReviewed(userReview);
        }

        fetchSpot();
    }, [spotId]);

    // If spot is not found, return a message
    if (!spot) {
        return <div>Spot Not Found</div>
    }
    // console.log(spot);

    // If no reviews, user is logged-in, and user is not owner, return a message
    const noReviews = () => {
        if (reviews.length === 0 && user && spot.Owner.id !== user.id) {
            return <div className="noReviews-message">Be the first to post a review!</div>
        }
    }
    // console.log(noReviews());

    const noImage = "https://placehold.co/600x400?text=No available image";

    // Grab the previewImage for the large image
    const previewImage = spot.SpotImages.find((image) => {
        return image = image.preview === true
    }).url;
    // const previewImage = noImage;
    // console.log(previewImage);

    // Grab the images for the small images
    const smallImages = [];
    spot.SpotImages.forEach((image) => {
        if(image.preview === false) {
            smallImages.push(image.url);
        }
    });
    // console.log(smallImages);

    // Determining average rating display
    const averageRating = spot.numReviews === 0
        ? "New"
        : spot.avgRating;
    // console.log(averageRating);
    
    // Determining review count display
    const reviewCount = spot.numReviews === 1
        ? " · 1 Review"
        : ` · ${spot.numReviews} Reviews`;
    // console.log(reviewCount);

    // Ordering reviews by most recent
    reviews.sort((a, b) => {
        // console.log(a.createdAt);
        return new Date(b.createdAt) - new Date(a.createdAt);
    });
    // console.log(reviews);

    // Extrapolate Date data from review.createdAt
    const reviewDates = [];
    reviews.forEach((review) => {
        // console.log(review.createdAt);
        const year = review.createdAt.slice(0, 4);
        const month = months[parseInt(review.createdAt.slice(5, 7))];
        reviewDates.push(`${month} ${year}`);
    });
    // console.log(reviewDates);

    // Conditions for posting a review button to appear:
    // 1. User is logged in and have not posted a review - appears
    // 2. User is logged in and is owner - hidden
    // 3. User is logged in and have posted a review - hidden
    // 4. User is not logged in - hidden

    const isOwner = user && spot.Owner.id === user.id;
    const hasBeenReviewed = reviews.find((review) => review.User.id === user.id);
    const canReview = user && !isOwner && !hasBeenReviewed;

    return (
        <>
            
            {/* Spot Detail Section */}

            <div className="spot-details">
                <h1 className="spot-name">{spot.name}</h1>
                <p className="spot-location">Location: {spot.city}, {spot.state}, {spot.country}</p>
                <div className="images">
                    <span className="large-image">
                        <img src={previewImage} alt="Large Image" />
                    </span>
                    <span className="small-images">
                        <img src={smallImages[0] || noImage} alt="Small Image 1"/>
                        <img src={smallImages[1] || noImage} alt="Small Image 2"/>
                        <img src={smallImages[2] || noImage} alt="Small Image 3"/>
                        <img src={smallImages[3] || noImage} alt="Small Image 4"/>
                    </span>
                </div>
                <div className="spot-information">
                    <div>
                        <h3 className="spot-host">Hosted by {spot.Owner.firstName} {spot.Owner.lastName}</h3>
                        <p className="spot-description">{spot.description}</p>
                    </div>
                    <div>
                        <div className="price-and-review-box">
                            <div className="price-and-review">
                                <p className="spot-price">${spot.price} night</p>
                                <span className="spot-review">
                                    <i className="fa-fa-star">⭐</i>
                                    {averageRating}
                                    {/* <span> · </span> */}
                                    <span>{spot.numReviews === 0
                                        ? ""
                                        : reviewCount}</span>
                                </span>
                            </div>
                            <button 
                                className="reserve-button"
                                onClick={() => alert("Feature coming soon")}
                            >Reserve</button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Reviews Section */}

            <div className="review-details">
                <h2>
                    <i className="fa-fa-star">⭐</i>
                    {averageRating}
                    {/* <span> · </span> */}
                    <span>{spot.numReviews === 0
                        ? ""
                        : reviewCount}
                    </span>
                </h2>
                {noReviews()}

                <div className="review-modal">
                    {canReview && (
                        <OpenModalButton
                            isOpen={isModalOpen}
                            onButtonClick={() => setIsModalOpen(true)}
                            buttonText={"Post Your Review"}
                            modalComponent={
                                <ReviewModal
                                    spotId={spotId}
                                    disabled={false}
                                    onChange={onChange}
                                    rating={rating}
                                />}
                            className="review-button"
                        />
                    )}
                </div>

                {/* {canReview && (
                    <button
                        className="review-button"
                        onClick={() => setShowReviewModal(true)}
                    >
                        Post Your Review
                    </button>
                )} */}

                <div className="reviews-list">
                    {reviews.map((review, index) => (
                        <div key={review.id} className="review-entry">
                            <span className="review-author">{review.User.firstName}</span>
                            <span className="review-date">{reviewDates[index]}</span>
                            <span className="review-text">{review.review}</span>
                            {(user && review.User.id === user.id && (
                            <OpenModalButton
                                buttonText="Delete"
                                modalComponent={<DeleteReviewModal review={review} />}
                                className="delete-review-button"
                            />
                            ))}
                            <hr />
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
}

export default SpotDetail;