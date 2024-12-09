// frontend/src/components/ReviewModal/ReviewModal.jsx

import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useModal } from '../../context/Modal';
import * as reviewActions from '../../store/reviews';
import { FaStar } from 'react-icons/fa6';
import './ReviewModal.css';

function ReviewModal({ spotId, disabled, onChange }) {
    const dispatch = useDispatch();
    const [rating, setRating] = useState(0);
    const [content, setContent] = useState("");
    const [errors, setErrors] = useState({});
    const { closeModal } = useModal();
    const [activeRating, setActiveRating] = useState(rating);

    const handleMouseEnter = (index) => {
        if (!disabled) {
            setActiveRating(index);
        }
    };

    const handleMouseLeave = () => {
        if (!disabled) {
            setActiveRating(rating);
        }
    }

    const handleClick = (index) => {
        if (!disabled && onChange) {
            console.log('Clicked rating:', index);
            setRating(index);
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        setErrors({});

        const newReview = {
            review: content,
            stars: parseInt(rating),
        }

        // console.log("newReview: ", newReview);

        return dispatch(
        reviewActions.createReview(spotId, newReview)
        )
        .then(closeModal)
        .catch(async (res) => {
            const data = await res.json();
            if (data?.errors) {
            setErrors(data.errors);
            }
        });
    };

    return (
        <>
            <h1>How was your stay?</h1>
            <form onSubmit={handleSubmit}>
                <label>
                    <textarea
                        placeholder="Leave your review here..."
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        required
                    />
                </label>
                {errors.content && <p className="errors">{errors.content}</p>}
                <label>
                    {/* <input
                        type="number"
                        value={rating}
                        onChange={(e) => setRating(e.target.value)}
                        required
                    /> */}
                    {/* {console.log(rating)} */}
                    <div className="rating-input">
                        {[1, 2, 3, 4, 5].map((index) => (
                            <div
                                key={index}
                                className={index <= activeRating ? 'filled' : 'empty'}
                                onMouseEnter={() => handleMouseEnter(index)}
                                onMouseLeave={handleMouseLeave}
                                onClick={() => handleClick(index)}
                            >
                                <FaStar />
                            </div>
                        ))}
                        <div className="stars">
                            Stars
                        </div>
                    </div>
                </label>
                {errors.rating && <p className="errors">{errors.rating}</p>}
                <button 
                    className="submit-button"
                    type="submit"
                    disabled={content.length < 10 || rating === 0}
                >Submit Your Review</button>
            </form>
        </>
    );
}

export default ReviewModal;