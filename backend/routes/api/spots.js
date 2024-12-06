// backend/routes/api/spots.js

const express = require('express');
const { Spot, User, Review, SpotImage, ReviewImage } = require('../../db/models');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { restoreUser, requireAuth } = require('../../utils/auth');

const router = express.Router();

// Helper function to get an average rating for a spot given its ID.
async function getAverageRating(spotId) {
    const reviews = await Review.findAll({
        where: {
            spotId,
        },
    });

    if (!reviews) {
        return 0;
    }

    const totalRating = reviews.reduce((sum, review) => sum + review.stars, 0);
    return totalRating / reviews.length;
};

// Helper function to get the preview image URL for a spot given its ID.
async function getPreviewImage(spotId) {
    const previewImage = await SpotImage.findOne({
        where: {
            spotId,
            preview: true,
        },
    });

    if (!previewImage) {
        return null;
    } else {
        return previewImage.url;
    }
};

// Helper function to get number of reviews for a spot given its ID.
async function getNumReviews(spotId) {
    const reviews = await Review.findAll({
        where: {
            spotId,
        },
    });

    return reviews.length;
}

// GET all Spots
router.get('/', handleValidationErrors, async (req, res) => {

    // Handle Query Params //
    let { page = 1, size = 20, minLat, maxLat, minLng, maxLng, minPrice, maxPrice } = req.query;

    const errors = new Error;
    errors.message = "Bad Request";
    errors.error = {};

    if (page < 1) {
        errors.error.page = "Page must be greater than or equal to 1";
    }

    if (size < 1 || size > 20) {
        errors.error.size = "Size must be between 1 and 20";
    }

    if (minLat && (minLat < -90 || minLat > 90)) {
        errors.error.minLat = "Minimum latitude is invalid";
    }

    if (maxLat && (maxLat < -90 || maxLat > 90)) {
        errors.error.maxLat = "Maximum latitude is invalid";
    }

    if (minLng && (minLng < -180 || minLng > 180)) {
        errors.error.minLng = "Minimum longitude is invalid";
    }

    if (maxLng && (maxLng < -180 || maxLng > 180)) {
        errors.error.maxLng = "Maximum longitude is invalid";
    }

    if (minLat > maxLat) {
        errors.error.minLat = "Minimum latitude is invalid";
        errors.error.maxLat = "Maximum latitude is invalid";
    }

    if (minLng > maxLng) {
        errors.error.minLng = "Minimum longitude is invalid";
        errors.error.maxLng = "Maximum longitude is invalid";
    }

    if (minPrice && minPrice < 0) {
        errors.error.minPrice = "Minimum price must be greater than or equal to 0";
    }

    if (maxPrice && maxPrice < 0) {
        errors.error.maxPrice = "Maximum price must be greater than or equal to 0";
    }

    if (minPrice > maxPrice) {
        errors.error.minPrice = "Minimum price is invalid";
        errors.error.maxPrice = "Maximum price is invalid";
    }

    if (Object.keys(errors.error).length > 0) {
        errors.status = 400;
        return next(errors);
    }

    page = parseInt(page);
    size = parseInt(size);

    const offset = (page - 1) * size;

    const where = {};

    if (minLat && maxLat) {
        where.lat = { [Op.between]: [minLat, maxLat] };
    }

    if (minLng && maxLng) {
        where.lng = { [Op.between]: [minLng, maxLng] };
    }

    if (minPrice && maxPrice) {
        where.price = { [Op.between]: [minPrice, maxPrice] };
    }

    // End of Query Params //

    try {
        const spots = await Spot.findAll({
            where,
            limit: size,
            offset,
        });

        if(!spots) {
            const err = new Error('Spots not found');
            err.status = 400;
            err.errors = { message: "Spots not found" };
            return next(err);
        }

        const finalSpots = await Promise.all(spots.map(async (spot) => {
            const avgRating = await getAverageRating(spot.id);
            const previewImage = await getPreviewImage(spot.id);

            return {
                ...spot.dataValues,
                avgRating,
                previewImage,
            };
        }));

        return res.status(200).json({ Spots: finalSpots });
    } catch (error) {
        next(error);
    }
});

// GET all of current User's Spots
router.get('/current', restoreUser, requireAuth, async (req, res, next) => {
    try {
        const { user } = req;

        if (user) {
            const userId = user.id;

            const spots = await Spot.findAll({
                where: {
                    ownerId: userId,
                },
            });

            if (!spots) {
                const err = new Error('Spots not found');
                err.status = 400;
                err.errors = { message: "Spots not found" };
                return next(err);
            }

            const finalSpots = await Promise.all(spots.map(async (spot) => {
                const avgRating = await getAverageRating(spot.id);
                const previewImage = await getPreviewImage(spot.id);

                return {
                    ...spot.dataValues,
                    avgRating,
                    previewImage,
                };
            }));

            return res.status(200).json({ Spots: finalSpots });
        } else {
            return res.status(400).json({ message: "Login required" });
        }
    } catch (error) {
        next(error);
    }
});

// GET a Spot by ID
router.get('/:id', handleValidationErrors, async (req, res, next) => {
    try {
        const spotId = req.params.id;
        const spot = await Spot.findByPk(spotId);

        if (!spot) {
            const err = new Error("Spot couldn't be found");
            err.status = 404;
            err.errors = { message: "Spot couldn't be found" };
            return next(err);
        }

        const avgRating = await getAverageRating(spot.id);
        const numReviews = await getNumReviews(spot.id);

        const spotImages = await SpotImage.findAll({
            where: {
                spotId,
            },
            attributes: ['id', 'url', 'preview'],
        });

        const owner = await User.findOne({
            where: {
                id: spot.ownerId,
            },
            attributes: ['id', 'firstName', 'lastName'],
        });

        return res.status(200).json({
            ...spot.dataValues,
            numReviews,
            avgRating,
            SpotImages: spotImages,
            Owner: owner,
        });
    } catch (error) {
        next(error);
    }
});

// GET all Reviews for a Spot by ID
router.get('/:id/reviews', handleValidationErrors, async (req, res, next) => {
    try {
        const spotId = req.params.id;

        if(!spotId) {
            const err = new Error("Spot couoldn't be found");
            err.status = 400;
            err.errors = { message: "Spot couldn't be found" };
            return next(err);
        }

        const reviews = await Review.findAll({
            where: {
                spotId,
            },
            include: [
                {
                    model: User,
                    attributes: ['id', 'firstName', 'lastName'],
                },
                {
                    model: ReviewImage,
                    attributes: ['id', 'url'],
                },
            ],
        });

        if (!reviews) {
            const err = new Error("Reviews couldn't be found");
            err.status = 404;
            err.errors = { message: "Reviews couldn't be found" };
            return next(err);
        }

        const formattedReviews = reviews.map((review) => {
            return {
                ...review.dataValues,
                User: review.User.dataValues,
                ReviewImages: review.ReviewImages,
            };
        });

        return res.status(200).json({ Reviews: formattedReviews });
    } catch (error) {
        next(error);
    }
});

/*******************************************************************************************/

// POST a new Spot
router.post('/', restoreUser, requireAuth, async (req, res, next) => {
    const { user } = req;
    const { address, city, state, country, lat, lng, name, description, price } = req.body;
    const errors = {};

    if (!user) {
        const err = new Error('Login required');
        err.status = 400;
        err.errors = { message: "Login required" };
        return next(err);
    }

    if (!address) {
        errors.address = "Street address is required";
    }
    if (!city) {
        errors.city = "City is required";
    }
    if (!state) {
        errors.state = "State is required";
    }
    if (!country) {
        errors.country = "Country is required";
    }
    if (lat && (lat < -90 || lat > 90)) {
        errors.lat = "Latitude must be between -90 and 90";
    }
    if (lng && (lng < -180 || lng > 180)) {
        errors.lng = "Longitude must be between -180 and 180";
    }
    if (!name || name.length > 50) {
        errors.name = "Name is required";
    }
    if (!description) {
        errors.description = "Description is required";
    }
    if (price === undefined || price < 0) {
        errors.price = "Price per day must be a positive number";
    }

    if (Object.keys(errors).length > 0) {;
        return res.status(400).json({ 
            message: "Bad Request", 
            errors,
        });
    }

    try {
        const newSpot = await Spot.create({
            ownerId: user.id,
            address,
            city,
            state,
            country,
            lat,
            lng,
            name,
            description,
            price,
        });

        return res.status(201).json({ Spot: newSpot });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// ADD image to a Spot by ID
router.post('/:spotId/images', restoreUser, requireAuth, async (req, res, next) => {
    const { user } = req;
    const { spotId } = req.params;
    const { url, preview } = req.body;

    if (!user) {
        const err = new Error('Login required');
        err.status = 400;
        err.errors = { message: "Login required" };
        return next(err);
    }

    try {
        const spot = await Spot.findByPk(spotId);

        if (!spot) {
            return res.status(404).json({
                message: "Spot couldn't be found",
            });
        }

        if (spot.ownerId !== user.id) {
            return res.status(403).json({
                message: "Forbidden: You are not allowed to add images to this spot",
            });
        }

        const errors = {};

        if (!url) {
            errors.url = "Image URL is required";
        }

        if (preview === undefined) {
            errors.preview = "Preview status is required";
        }

        if (Object.keys(errors).length > 0) {
            return res.status(400).json({ 
                message: "Bad Request", 
                errors,
            });
        }

        const newImage = await SpotImage.create({
            spotId,
            url,
            preview,
        });

        return res.status(201).json({ 
            "id": newImage.id,
            "url": newImage.url,
            "preview": newImage.preview,
         });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Createa a new Review for a Spot by ID
router.post('/:spotId/reviews', restoreUser, requireAuth, async (req, res, next) => {
    const { user } = req;
    const { spotId } = req.params;
    const { stars, review } = req.body;

    if (!user) {
        const err = new Error('Login required');
        err.status = 400;
        err.errors = { message: "Login required" };
        return next(err);
    }

    try {
        const spot = await Spot.findByPk(spotId);

        if (!spot) {
            return res.status(404).json({
                message: "Spot couldn't be found",
            });
        }

        const reviewExists = await Review.findOne({
            where: {
                userId: user.id,
                spotId,
            },
        });

        if (reviewExists) {
            return res.status(500).json({
                message: "User already has a review for this spot",
            });
        }

        const errors = {};

        if (!stars || stars < 1 || stars > 5) {
            errors.stars = "Stars must be an integer between 1 and 5";
        }

        if (!review) {
            errors.review = "Review text is required";
        }

        if (Object.keys(errors).length > 0) {
            return res.status(400).json({ 
                message: "Bad Request", 
                errors,
            });
        }

        const newReview = await Review.create({
            userId: user.id,
            spotId,
            stars,
            review,
        });

        return res.status(201).json({ Review: newReview });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// EDIT a Spot by ID
router.put('/:spotId', restoreUser, requireAuth, async (req, res, next) => {
    const { user } = req;
    const { spotId } = req.params;
    const { address, city, state, country, lat, lng, name, description, price } = req.body;

    if (!user) {
        const err = new Error('Login required');
        err.status = 400;
        err.errors = { message: "Login required" };
        return next(err);
    }

    try {
        const spot = await Spot.findByPk(spotId);

        if (!spot) {
            return res.status(404).json({
                message: "Spot couldn't be found",
            });
        }

        if (spot.ownerId !== user.id) {
            return res.status(403).json({
                message: "Forbidden: You are not allowed to edit this spot",
            });
        }

        const errors = {};

        if (!address) {
            errors.address = "Street address is required";
        }
        if (!city) {
            errors.city = "City is required";
        }
        if (!state) {
            errors.state = "State is required";
        }
        if (!country) {
            errors.country = "Country is required";
        }
        if (lat && (lat < -90 || lat > 90)) {
            errors.lat = "Latitude must be between -90 and 90";
        }
        if (lng && (lng < -180 || lng > 180)) {
            errors.lng = "Longitude must be between -180 and 180";
        }
        if (!name || name.length > 50) {
            errors.name = "Name is required";
        }
        if (!description) {
            errors.description = "Description is required";
        }
        if (price === undefined || price < 0) {
            errors.price = "Price per day must be a positive number";
        }

        if (Object.keys(errors).length > 0) {;
            return res.status(400).json({ 
                message: "Bad Request", 
                errors,
            });
        }

        spot.address = address;
        spot.city = city;
        spot.state = state;
        spot.country = country;
        spot.lat = lat;
        spot.lng = lng;
        spot.name = name;
        spot.description = description;
        spot.price = price;

        await spot.save();

        return res.status(200).json({ Spot: spot });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// DELETE a Spot by ID
router.delete('/:spotId', restoreUser, requireAuth, async (req, res, next) => {
    const { user } = req;
    const { spotId } = req.params;

    if (!user) {
        const err = new Error('Login required');
        err.status = 400;
        err.errors = { message: "Login required" };
        return next(err);
    }

    try {
        const spot = await Spot.findByPk(spotId);

        if (!spot) {
            return res.status(404).json({
                message: "Spot couldn't be found",
            });
        }

        if (spot.ownerId !== user.id) {
            return res.status(401).json({
                message: "Forbidden: You are not allowed to delete this spot",
            });
        }

        await spot.destroy();

        return res.status(200).json({
            message: "Successfully deleted"
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;