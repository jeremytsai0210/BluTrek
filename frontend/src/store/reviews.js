// frontend/src/store/reviews.js

import { csrfFetch } from './csrf';

// Action Types
const LOAD_REVIEWS = 'reviews/LOAD_REVIEWS';
const ADD_REVIEW = 'reviews/ADD_REVIEW';
const REMOVE_REVIEW = 'reviews/REMOVE_REVIEW';

// Action Creators
const loadReviews = (spotId, reviews) => ({
    type: LOAD_REVIEWS,
    spotId,
    reviews,
});

const addReview = (review) => ({
    type: ADD_REVIEW,
    review,
});

const removeReview = (reviewId) => ({
    type: REMOVE_REVIEW,
    reviewId,
});

// Thunks
export const fetchReviews = (spotId) => async dispatch => {
    const response = await csrfFetch(`/api/spots/${spotId}/reviews`);

    if (response.ok) {
        const reviews = await response.json();
        console.log('\n');
        console.log(reviews);
        console.log('\n');
        dispatch(loadReviews(spotId, reviews));
    }
};

export const createReview = (spotId, review) => async dispatch => {
    // console.log("SpotId: ", spotId);
    // console.log("Review: ", review);
    const response = await csrfFetch(`/api/spots/${spotId}/reviews`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(review),
    });

    // console.log("Response: ", response);

    if (response.ok) {
        const newReview = await response.json();
        dispatch(addReview(newReview));
        dispatch(fetchReviews(spotId));
        window.location.reload();
        return newReview;
    } else {
        console.error("Failed to submit review: ", response);
    }
};

export const deleteReview = ( reviewId) => async dispatch => {
    const response = await csrfFetch(`/api/reviews/${reviewId}`, {
        method: 'DELETE',
    });

    if (response.ok) {
        dispatch(removeReview(reviewId));
    } else {
        console.error("Failed to delete review: ", response);
    }
};

// Reducer
const initialState = {};

const reviewsReducer = (state = initialState, action) => {
    switch (action.type) {
        case LOAD_REVIEWS: {
            return {...state, [action.reviews.spotId]: action.reviews };
        }
        case ADD_REVIEW:
            return {...state, [action.spotId]: [...state(state[action.spotId] || []), action.review]};
        case REMOVE_REVIEW: {
            const updatedState = state[action.spotId]?.filter(review => review.id !== action.reviewId) || [];
            return {...state, [action.spotId]: updatedState};
        }
        default:
            return state;
    }
};

export default reviewsReducer;