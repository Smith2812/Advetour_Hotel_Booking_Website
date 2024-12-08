if (process.env.NODE_ENV !== "production") {
  require('dotenv').config();
}

const mongoose = require('mongoose');
const Pilgrimage = require('../model/pilgrimage');
const pilgrimages = require('./Pilgrimage');
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mbxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({ accessToken: mbxToken });

main().catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/Advetour');
  console.log("Database connected!");
}

const sample = array => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
  await Pilgrimage.deleteMany({});

  for (let i = 0; i < 20; i++) {
      const random20 = Math.floor(Math.random() * 20);

      const pilgrimage = new Pilgrimage({
          admin: '66914a8ba61afdaa75a7f0d0',
          location: `${pilgrimages[random20].city},${pilgrimages[random20].state}`,
          title: `${pilgrimages[random20].city}`,
          geometry: {},
          images: [
              {
                  url: 'https://res.cloudinary.com/dz5avvhqj/image/upload/v1719253129/YelpCamp/i9k6b2s5xkwvdvo3fv2a.jpg',
                  filename: 'YelpCamp/i9k6b2s5xkwvdvo3fv2a'
              }
          ]
      });

      try {
          const geodata = await geocoder.forwardGeocode({
              query: pilgrimage.location,
              limit: 1
          }).send();

          pilgrimage.geometry = geodata.body.features[0].geometry;
          await pilgrimage.save();
      } catch (error) {
          console.error(`Error fetching geodata for location: ${pilgrimage.location}`, error);
      }
  }
};

seedDB().then(() => {
  mongoose.connection.close();
});
