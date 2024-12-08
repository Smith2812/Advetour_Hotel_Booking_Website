if(process.env.NODE_ENV !== "production"){
    require('dotenv').config();
}

const mongoose=require('mongoose')
const Adventure=require('../model/adventure')
const adventures=require('./adventure')
const mbxGeocoding=require('@mapbox/mapbox-sdk/services/geocoding');
const mbxToken=process.env.MAPBOX_TOKEN;
const geocoder=mbxGeocoding({accessToken:mbxToken});
  
  

  main().catch(err => console.log(err));
  
  async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/Advetour');
    console.log("Hello done !!")
  }
  
  const sample = array => array[Math.floor(Math.random()*array.length)];
  
  const seedDB=async()=>{
      await Adventure.deleteMany({});
      
      for(let i=0;i<20;i++){
          const random20=Math.floor(Math.random()*20);
  
          const adve=new Adventure({
              admin:'66914a8ba61afdaa75a7f0d0',
              location:`${adventures[random20].city},${adventures[random20].state}`,
              title :`${adventures[random20].adventure}`,
              geometry:{},
              images: [
                  {
                    url: 'https://res.cloudinary.com/dz5avvhqj/image/upload/v1719253129/YelpCamp/i9k6b2s5xkwvdvo3fv2a.jpg',
                    filename: 'YelpCamp/i9k6b2s5xkwvdvo3fv2a'
                  }
              ]
          })
          
          const geodata=await geocoder.forwardGeocode({
            query:adve.location,
            limit:1
          }).send();
  
          adve.geometry=geodata.body.features[0].geometry;
  
          await adve.save();
      }
  }
  
  seedDB().then(()=>{
     mongoose.connection.close()
  });
  