const express = require("express");
const { ReviewImage, Review } = require("../../db/models");
const { requireAuth } = require("../../utils/auth");

const router = express.Router();

router.delete("/:imageId", requireAuth, async (req, res) => {
    const imageId = req.params.imageId;
    const userId = req.user.id;
    
    const reviewImage = await ReviewImage.findByPk(imageId);
    
    if (!reviewImage) {
        return res.status(404).json({ message: "Review Image couldn't be found" });
    }
    
    const review = await Review.findOne({
        where: {
        id: reviewImage.reviewId,
        },
        attributes: ["id", "userId"],
    });
    
    if (userId !== review.userId) {
        return res.status(403).json({ message: "Unauthorized to delete this image" });
    }
    
    try {
        await reviewImage.destroy();
    
        res.status(200).json({ message: "Successfully deleted" });
    } catch (err) {
        res.status(500).json({ message: "Error deleting ReviewImage" });
    }
});

module.exports = router;