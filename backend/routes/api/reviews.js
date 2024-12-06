// backend/routes/api/reviews.js

const express = require('express');
const { Review, User, Spot, ReviewImage, SpotImage } = require('../../db/models');
const { requireAuth } = require('../../utils/auth');

const router = express.Router();

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

// Get all Reviews of the Current User
router.get('/current', requireAuth, async (req, res) => {
    try {
        const currentUser = parseInt(req.user.dataValues.id);

        const reviews = await Review.findAll({
            where: {
                userId: currentUser
            },
            include: [
                {
                    model: User,
                    attributes: ['id', 'firstName', 'lastName']
                },
                {
                    model: Spot,
                    attributes: ['id', 'ownerId', 'address', 'city', 'state',
                        'country', 'lat', 'lng', 'name', 'price'
                    ],
                    include: [
                        {
                            model: SpotImage,
                            where: {
                                preview: true
                            },
                            attributes: ['url']
                        }
                    ]
                },
                {
                    model: ReviewImage,
                    attributes: ['id', 'url']
                }
            ]
        });

        const formattedReviews = reviews.map(review => {
            const reviewData = review.toJSON();

            // Extract the previewImage if available
            reviewData.Spot.previewImage = reviewData.Spot.SpotImages.length > 0
                ? reviewData.Spot.SpotImages[0].url
                : null;

            // Remove SpotImages from the response if not needed
            delete reviewData.Spot.SpotImages;

            return reviewData;
        });

        res.json({ Reviews: formattedReviews });
    } catch (err) {
        res.status(500).json({ message: "Error fetching all Reviews from current User" })
    }
});

// Add an Image to a Review based on the Review ID
router.post('/:reviewId/images', requireAuth, async (req, res) => {
    const { url } = req.body;
    const userId = req.user.id;
    const reviewId = req.params.reviewId;

    if (!url) {
        return res.status(400).json({ 
            message: "Image URL is required" 
        });
    }

    try {
        const review = await Review.findByPk(reviewId);

        if (!review) {
            return res.status(404).json({ 
                message: "Review couldn't be found" 
            });
        }

        if (review.userId !== userId) {
            return res.status(401).json({ 
                message: "User is not authorized to add an image to this review" 
            });
        }

        const imageCount = await ReviewImage.count({
            where: {
                reviewId
            }
        });

        if (imageCount >= 10) {
            return res.status(403).json({ 
                message: "Maximum number of images for this resource was reached" 
            });
        }

        const newImage = await ReviewImage.create({
            reviewId,
            url
        });

        res.status(201).json({ newImage });
    } catch (err) {
        res.status(500).json({ message: "Error adding an image to the review" });
    }
});

// Edit a Review
router.put('/:reviewId', requireAuth, async (req, res) => {
    const { review, stars } = req.body;
    const userId = req.user.id;
    const reviewId = req.params.reviewId;

    const errors = {};

    if (!review) {
        errors.review = "Review text is required";
    }

    if (!stars) {
        errors.stars = "Stars must be an integer from 1 to 5";
    }

    if (Object.keys(errors).length > 0) {
        return res.status(400).json({ errors });
    }

    try {
        const reviewToUpdate = await Review.findByPk(reviewId);

        if (!reviewToUpdate) {
            return res.status(404).json({ message: "Review couldn't be found" });
        }

        if (reviewToUpdate.userId !== userId) {
            return res.status(401).json({ message: "User is not authorized to edit this review" });
        }

        await reviewToUpdate.update({
            review,
            stars
        });

        res.json({ reviewToUpdate });
    } catch (err) {
        res.status(500).json({ message: "Error updating the review" });
    }
});

// Delete a Review
router.delete('/:reviewId', requireAuth, async (req, res) => {
    const userId = req.user.id;
    const reviewId = req.params.reviewId;

    try {
        const reviewToDelete = await Review.findByPk(reviewId);

        if (!reviewToDelete) {
            return res.status(404).json({ message: "Review couldn't be found" });
        }

        if (reviewToDelete.userId !== userId) {
            return res.status(401).json({ message: "User is not authorized to delete this review" });
        }

        await reviewToDelete.destroy();

        res.status(200).json({ message: "Successfully deleted" });
    } catch (err) {
        res.status(500).json({ message: "Error deleting the review" });
    }
});

module.exports = router;