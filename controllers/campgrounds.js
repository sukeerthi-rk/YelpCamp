const catchAsync = require('../utils/catchAsync');
const Campground = require('../models/campground');

module.exports.index = async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', { campgrounds, title: 'All campgrounds' })
}
module.exports.renderNewForm = (req, res) => {
    res.render('campgrounds/new', { title: 'New campground' })
}
module.exports.createCampground = async (req, res, next) => {
    const campground = new Campground(req.body.campground);
    campground.author = req.user._id;
    await campground.save();
    req.flash('success', 'Successfully made a new campground!')
    res.redirect(`/campgrounds/${campground._id}`)
}
module.exports.showCampground = async (req, res, next) => {
    const campground = await Campground.findById(req.params.id).populate({ path: 'reviews', populate: { path: 'author' } }).populate('author');
    if (!campground) {
        req.flash('error', 'Could not find that campground');
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/show', { campground, title: `${campground.title}` })
}
module.exports.renderEditForm = async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    if (!campground) {
        req.flash('error', 'Could not find that campground');
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/edit', { campground, title: `edit ${campground.title}` })
}