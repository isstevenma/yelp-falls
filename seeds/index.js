const mongoose = require('mongoose');
const cities = require('./cities');
const { places, descriptors } = require('./seedHelpers');
const Waterfall = require('../models/waterfall');

mongoose.connect('mongodb://localhost:27017/yelp-waterfall', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const sample = (array) => {
    return array[Math.floor(Math.random() * array.length)];

}

const seedDB = async () => {
    await Waterfall.deleteMany({});
    for (let i = 0; i < 200; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const camp = new Waterfall({
            author: "60f508d017f0c647c8db3bcc",
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            geometry: { 
                type: 'Point',
                 coordinates: [cities[random1000].longitude, cities[random1000].latitude] 
                },
            images: [
                {
                    url: 'https://res.cloudinary.com/dkyenyhnu/image/upload/v1627102193/YelpFalls/a9cacvd6lqmg2qavqggu.png',
                    filename: 'YelpFalls/a9cacvd6lqmg2qavqggu'
                },
                {
                    url: 'https://res.cloudinary.com/dkyenyhnu/image/upload/v1627102194/YelpFalls/glto5hfn1q7hyk92ly79.png',
                    filename: 'YelpFalls/glto5hfn1q7hyk92ly79'
                }
            ],
            description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Id, corporis possimus. Ullam id vel repellendus. Quibusdam sit eos atque ea perspiciatis nostrum enim quo vero, qui illum neque harum alias?'
        })
        await camp.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close();
});