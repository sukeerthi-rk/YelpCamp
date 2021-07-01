const express = require('express');
const router = express.Router({ mergeParams: true });
const Campground = require('../models/campground');
const ExpressError = require('../utils/ExpressError');
const catchAsync = require('../utils/catchAsync');
const Review = require('../models/review');
const { reviewSchema } = require('../schemas');


const validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}


router.post('/', validateReview, catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    const addreview = new Review(req.body.review);
    await campground.reviews.push(addreview);
    await addreview.save();
    await campground.save();
    req.flash('success', 'Successfully added a new review!')
    res.redirect(`/campgrounds/${campground._id}`)
}))
router.delete('/:reviewId', catchAsync(async (req, res) => {
    const { id, reviewId } = req.params;
    await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'Successfully deleted the review!')
    res.redirect(`/campgrounds/${id}`)
}))

module.exports = router;