const Waterfall = require('../models/waterfall');
const { cloudinary } = require('../cloudinary');
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({ accessToken: mapBoxToken });


module.exports.index = async (req, res) => {
    const waterfalls = await Waterfall.find({});
    res.render('waterfalls/index', { waterfalls, });
}

module.exports.renderNewForm = (req, res) => {
    res.render('waterfalls/new');
}

module.exports.createWaterfall = async (req, res, next) => {
    const geoData = await geocoder.forwardGeocode({
        query: req.body.waterfall.location,
        limit: 1
    }).send();
    const waterfall = new Waterfall(req.body.waterfall);
    waterfall.geometry = geoData.body.features[0].geometry;
    waterfall.images = req.files.map(f => ({ url: f.path, filename: f.filename }));
    waterfall.author = req.user._id;
    await waterfall.save();
    console.log(waterfall);
    req.flash('success', 'Succesfully Made New Campground');
    res.redirect(`/waterfalls/${waterfall._id}`);
}

module.exports.showWaterfall = async (req, res) => {
    const waterfall = await Waterfall.findById(req.params.id).populate({
        path: 'reviews',
        populate: {
            path: 'author'
        }
    }).populate('author');
    // console.log(waterfall);
    if (!waterfall) {
        req.flash('error', 'Cannot find that campground');
        return res.redirect('/waterfalls');
    }
    res.render('waterfalls/show', { waterfall });
}

module.exports.renderEditForm = async (req, res) => {
    const waterfall = await Waterfall.findById(req.params.id);
    if (!waterfall) {
        req.flash('error', 'Cannot find that campground');
        return res.redirect('/waterfalls');
    }
    res.render('waterfalls/edit', { waterfall });
}

module.exports.updateWaterfall = async (req, res) => {
    const { id } = req.params;
    const updatedWaterfall = await Waterfall.findByIdAndUpdate(id, { ...req.body.waterfall });
    const imgs = req.files.map(f => ({ url: f.path, filename: f.filename }));
    updatedWaterfall.images.push(...imgs);
    await updatedWaterfall.save();
    if (req.body.deleteImages) {
        for (let filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename);
        }
        await updatedWaterfall.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages } } } });
    }
    req.flash('success', "Successfully updated waterfall!");
    res.redirect(`/waterfalls/${updatedWaterfall._id}`);
}

module.exports.deleteWaterfall = async (req, res) => {
    const { id } = req.params;
    const deletedWaterfall = await Waterfall.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted campground!');
    res.redirect('/waterfalls');
}