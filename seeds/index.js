const mongoose = require('mongoose');
const cities = require('./cities')
const Ground = require('../models/grounds')
const { places, descriptors } = require('./seedHelpers')

mongoose.connect('mongodb://localhost:27017/white-soxs')

const db = mongoose.connection;
db.on("error", console.error.bind(console, "conncetion error: "));
db.once('open', () => {
    console.log("Database connected!")
});

const sample = (array) => array[Math.floor(Math.random() * array.length)];

const seedDB = async() => {
    await Ground.deleteMany({});
    for (let i = 0; i < 6; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 20) + 10;
        const gd = new Ground({
            author: '63978d2ed8665821c4c912b0',
            location: `${cities[random1000].city},${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            image: `https://source.unsplash.com/random?indoor-ground,${i}`,
            description: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry',
            price,
            geometry: {
                type: 'Point',
                coordinates: [
                    cities[random1000].longitude,
                    cities[random1000].latitude
                ]

            },
            images: [{
                    url: 'https://res.cloudinary.com/dglikuuvz/image/upload/v1673164557/White-Soxs/zhg11mend1o1ixm2i3pr.png',
                    filename: 'White-Soxs/zhg11mend1o1ixm2i3pr',
                },
                {
                    url: 'https://res.cloudinary.com/dglikuuvz/image/upload/v1673164560/White-Soxs/sxzrbdoalp3hguyry2uj.png',
                    filename: 'White-Soxs/sxzrbdoalp3hguyry2uj',
                }
            ],
        })
        await gd.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close();
})