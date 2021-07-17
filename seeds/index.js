const mongoose = require('mongoose');
const cities = require('./cities');
const { places, descriptors } = require('./seedHelpers');
const Campground = require('../models/campground');
mongoose.connect('mongodb://localhost:27017/yelp-camp', { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true })
    .then(() => {
        console.log("connected to database")
    }).catch((e) => {
        console.log(e, 'error connecting to database')
    })

const sample = array => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
    await Campground.deleteMany({});
    for (let i = 0; i < 50; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 20) + 10;
        const camp = new Campground({
            author: '60e72a0886413f08040662d4',
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            geoJson: {
                type: "Point",
                coordinates: [77.609864, 12.970188]
            },
            title: `${sample(descriptors)} ${sample(places)}`,
            description: 'Lorem ipsum, dolor sit amet consectetur adipisicing elit.Nisi, odit eveniet atque quidem ipsa ullam inventore at accusamus, eum repudiandae aspernatur accusantium corporis distinctio dignissimos iusto tempora sit recusandae soluta?',
            price: 24.50,
            images: [
                {
                    url: 'https://res.cloudinary.com/yelptrail/image/upload/v1626274163/YelpTrail/ljahmpix605rkivwyoam.jpg',
                    filename: 'YelpTrail/ljahmpix605rkivwyoam'
                },
                {
                    url: 'https://res.cloudinary.com/yelptrail/image/upload/v1626274166/YelpTrail/ypwjxydda03ia0s6m2ij.jpg',
                    filename: 'YelpTrail/ypwjxydda03ia0s6m2ij'
                },
                {
                    url: 'https://res.cloudinary.com/yelptrail/image/upload/v1626274169/YelpTrail/g8jzmfpmg6phxj2b2wth.jpg',
                    filename: 'YelpTrail/g8jzmfpmg6phxj2b2wth'
                }
            ]
        })
        await camp.save();
    }
}
seedDB().then(() => {
    mongoose.connection.close();
})