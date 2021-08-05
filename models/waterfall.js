const mongoose = require('mongoose');
const Review = require('./review');
const Schema = mongoose.Schema;


const ImageSchema = new Schema({
    url: String,
    filename: String

});

ImageSchema.virtual('thumbnail').get(function () {
    return this.url.replace('/upload', '/upload/w_300');
});

const opts = {toJSON: {virtuals: true} };
const WaterfallSchema = new Schema({
    title: String,
    images: [
        ImageSchema
    ],
    geometry: {
        type: {
            type: String,
            enum: ['Point'],
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },
    description: String,
    location: String,
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: "Review"
        }
    ]

}, opts);


WaterfallSchema.virtual('properties.popUpMarkup').get(function () {
    return `<strong><a href="/waterfalls/${this._id}">${this.title}</a><strong>
    <p>${this.description.substring(0,30)}...</p>
    `
});

WaterfallSchema.post('findOneAndDelete', async function (doc) {
    if (doc) {
        await Review.remove({
            _id: {
                $in: doc.reviews
            }
        })
    }
});

module.exports = mongoose.model('Waterfall', WaterfallSchema);