const Waterfall = require('../models/waterfall');
const Review = require('../models/review');

module.exports.createReview = async (req, res) => {
    const waterfall = await Waterfall.findById(req.params.id);
    const review = new Review(req.body.review);
    review.author = req.user._id;
    waterfall.reviews.push(review);
    await review.save();
    await waterfall.save();
    req.flash('success', 'Created new review!');
    res.redirect(`/waterfalls/${waterfall._id}`);
}

module.exports.deleteReview = async (req, res) => {
    const { id, reviewId } = req.params;
    await Waterfall.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'Successfully deleted review!');
    res.redirect(`/waterfalls/${id}`);

}