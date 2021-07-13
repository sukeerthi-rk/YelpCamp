const Campground = require('../models/campground');
const Review = require('../models/review');

module.exports.createReview = async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    const addreview = new Review(req.body.review);
    addreview.author = req.user._id;
    await campground.reviews.push(addreview);
    await addreview.save();
    await campground.save();
    req.flash('success', 'Successfully added a new review!')
    res.redirect(`/campgrounds/${campground._id}`)
}

module.exports.deleteReview = async (req, res) => {
    const { id, reviewId } = req.params;
    await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'Successfully deleted the review!')
    res.redirect(`/campgrounds/${id}`)
}