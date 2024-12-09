import { csrfFetch } from "./csrf";

// Action Types
export const LOAD_SPOTS = "spots/LOAD_SPOTS";
export const ADD_SPOT = "spots/ADD_SPOT";
export const UPDATE_SPOT = "spots/UPDATE_SPOT";
export const DELETE_SPOT = "spots/DELETE_SPOT";

export const ADD_SPOT_IMAGES = "spots/ADD_SPOT_IMAGES";

// Action Creators
// GET
const load = (spots) => {
    // console.log('Action - Loading Spots:', spots);
    return {
        type: LOAD_SPOTS,
        spots: spots.Spots
    };
}

// POST
const add = (spot) => {
    // console.log('Action - Adding Spot:', spot);
    return {
        type: ADD_SPOT,
        spot
    };
}

// PUT
const update = (spot) => {
    // console.log('Action - Updating Spot:', spot);
    return {
        type: UPDATE_SPOT,
        spot
    };
}

// DELETE
const remove = (spotId) => {
    // console.log('Action - Deleting Spot:', spotId);
    return {
        type: DELETE_SPOT,
        spotId
    }
}

// POST Spot Images
const addImages = (images, spotId) => {
    return {
        type: ADD_SPOT_IMAGES,
        image: {
            ...images,
            spotId
        }
    }
}

// Validate user
const isLoggedIn = (state) => {
    // console.log('Checking if there is a logged in User');
    return state.session.user !== null;
}

// GET all Spots
export const getAllSpots = () => async dispatch => {
    // console.log('Fetch - GET all Spots');
    const response = await fetch('/api/spots');
    
    if (response.ok) {
        const spots = await response.json();
        dispatch(load(spots));
    }
}

// GET a single Spot through its ID
// export const getSpotDetail = (spotId) => async dispatch => {
//     // console.log('Fetch = GET a single Spot: ', spotId);
//     const response = await fetch(`/api/spots/${spotId}`);

//     if (response.ok) {
//         const spot = await response.json();
//         dispatch(load(spot));
//     }
// }

// POST a Spot
export const createSpot = (spot) => async dispatch => {
    console.log('Fetch - POST a Spot:', spot);
    const response = await csrfFetch('/api/spots', {
        method: 'POST',
        body: JSON.stringify(spot)
    });

    console.log('Response:', response);

    if (response.ok) {
        const newSpot = await response.json();
        dispatch(add(newSpot));
        return newSpot;
    }
}

// PUT a Spot
export const updateSpot = (spot) => async dispatch => {
    // console.log('Fetch - PUT a Spot:', spot);
    const response = await csrfFetch(`/api/spots/${spot.id}`, {
        method: 'PUT',
        body: JSON.stringify(spot)
    });

    if (response.ok) {
        const updatedSpot = await response.json();
        dispatch(update(updatedSpot));
        return updatedSpot;
    }
}

// DELETE a Spot
export const deleteSpot = (spotId) => async dispatch => {
    // console.log('Fetch - DELETE a Spot:', spotId);
    const response = await csrfFetch(`/api/spots/${spotId}`, {
        method: 'DELETE'
    });

    if (response.ok) {
        dispatch(remove(spotId));
    }
}

// POST Spot Images
export const createSpotImages = (spotId, previewImage, images) => async dispatch => {
    console.log('Fetch - POST Spot Images:', images);
    
    console.log('previewImage: ', previewImage);
    console.log('images: ', images);
    // Need to separate all images one by one.
    // Create each JSON body and send them one by one.
    const previewResponse = await csrfFetch(`/api/spots/${spotId}/images`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(previewImage),
    });

    console.log("Preview Response: ", previewResponse);

    if (previewResponse.ok) {
        const newPreviewImage = await previewResponse.json();
        dispatch(addImages(newPreviewImage, spotId));
    } else {
        console.error("Failed to submit preview image: ", previewResponse);
    }
    
    images.forEach(async (image) => {
        const response = await csrfFetch(`/api/spots/${spotId}/images`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(image),
        });

        console.log("Response: ", response);

        if (response.ok) {
            const newImage = await response.json();
            dispatch(addImages(newImage, spotId));
        } else {
            console.error("Failed to submit image: ", response);
        }
    });

    console.log("All images submitted.");

    return previewImage, images;

    // const response = await csrfFetch(`/api/spots/${spotId}/images`, {
    //     method: 'POST',
    //     headers: {
    //         'Content-Type': 'application/json',
    //     },
    //     body: JSON.stringify(images),
    // });

    // if (response.ok) {
    //     const newImages = await response.json();
    //     dispatch(addImages(newImages));
    //     return newImages;
    // } else {
    //     console.error("Failed to submit images: ", response);
    // }
}

// Reducer
const initialState = {};

const spotsReducer = (state = initialState, action) => {
    switch (action.type) {
        case LOAD_SPOTS: {
            const allSpots = {};
            action.spots.forEach(spot => {
                allSpots[spot.id] = spot;
            });
            return {
                ...allSpots,
                ...state
            };
        }
        case ADD_SPOT: {
            return {
                ...state,
                [action.spot.id]: action.spot
            };
        }
        case UPDATE_SPOT: {
            return {
                ...state,
                [action.spot.id]: action.spot
            };
        }
        case DELETE_SPOT: {
            const newState = { ...state };
            delete newState[action.spotId];
            return newState;
        }
        case ADD_SPOT_IMAGES: {
            const spotId = action.image.spotId;
            return {
                ...state,
                [spotId]: {
                    ...state[spotId],
                    spotImages: [
                        ...(state[spotId]?.spotImages || []),
                        action.image
                    ]
                }
            };
        }
        default:
            return state;
    }
}

export default spotsReducer;
