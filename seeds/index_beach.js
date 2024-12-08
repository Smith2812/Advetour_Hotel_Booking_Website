if(process.env.NODE_ENV !== "production"){
    require('dotenv').config();
}

const mongoose=require('mongoose')
const Beach=require('../model/beaches')
const beaches=require('./beaches')
const mbxGeocoding=require('@mapbox/mapbox-sdk/services/geocoding')
const mbxToken=process.env.MAPBOX_TOKEN;
const geocoder=mbxGeocoding({accessToken:mbxToken});
  
  

  main().catch(err => console.log(err));
  
  async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/Advetour');
    console.log("Hello done !!")
  }
  
  const sample = array => array[Math.floor(Math.random()*array.length)];
  
  const seedDB=async()=>{
      await Beach.deleteMany({});
      
      for(let i=0;i<20;i++){
          const random20=Math.floor(Math.random()*20);
  
          const beach=new Beach({
              admin:'66914a8ba61afdaa75a7f0d0',
              location:`${beaches[random20].beach},${beaches[random20].state}`,
              title :`Stays in & around ${beaches[random20].beach} for weekend holidays`,
              geometry:{},
              images: [
                  {
                    url: 'https://res.cloudinary.com/dz5avvhqj/image/upload/v1719253129/YelpCamp/i9k6b2s5xkwvdvo3fv2a.jpg',
                    filename: 'YelpCamp/i9k6b2s5xkwvdvo3fv2a'
                  }
              ]
          })
          
          const geodata=await geocoder.forwardGeocode({
            query:beach.location,
            limit:1
          }).send();
  
          beach.geometry=geodata.body.features[0].geometry;
  
          await beach.save();
      }
  }
  
  seedDB().then(()=>{
     mongoose.connection.close()
  });
  