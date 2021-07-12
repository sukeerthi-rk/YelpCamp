const express = require('express');
const router = express.Router({ mergeParams: true });
const Campground = require('../models/campground');
const catchAsync = require('../utils/catchAsync');
const Review = require('../models/review');
const { validateReview, isLoggedIn, isReviewAuthor } = require('../utils/middleware');





router.post('/', isLoggedIn, validateReview, catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    const addreview = new Review(req.body.review);
    addreview.author = req.user._id;
    await campground.reviews.push(addreview);
    await addreview.save();
    await campground.save();
    req.flash('success', 'Successfully added a new review!')
    res.redirect(`/campgrounds/${campground._id}`)
}))
router.delete('/:reviewId', isLoggedIn, isReviewAuthor, catchAsync(async (req, res) => {
    const { id, reviewId } = req.params;
    await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'Successfully deleted the review!')
    res.redirect(`/campgrounds/${id}`)
}))

module.exports = router;