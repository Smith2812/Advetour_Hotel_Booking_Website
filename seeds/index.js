if(process.env.NODE_ENV !== "production"){
    require('dotenv').config();
}

const mongoose=require('mongoose')
const Staycity=require('../model/staycity')
const cities=require('./cities')
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
      await Staycity.deleteMany({});
      
      for(let i=0;i<80;i++){
          const random80=Math.floor(Math.random()*80);
          const price =Math.floor(Math.random()*1000);
  
          const staycity=new Staycity({
              admin:'66914a8ba61afdaa75a7f0d0',
              location:`${cities[random80].city},${cities[random80].state}`,
              title :`Stays in & around ${cities[random80].city} for weekend holidays`,
              geometry:{},
              images: [
                  {
                    url: 'https://res.cloudinary.com/dz5avvhqj/image/upload/v1719253129/YelpCamp/i9k6b2s5xkwvdvo3fv2a.jpg',
                    filename: 'YelpCamp/i9k6b2s5xkwvdvo3fv2a'
                  }
              ]
          })
          
          const geodata=await geocoder.forwardGeocode({
            query:staycity.location,
            limit:1
          }).send();
  
          staycity.geometry=geodata.body.features[0].geometry;
  
          await staycity.save();
      }
  }
  
  seedDB().then(()=>{
     mongoose.connection.close()
  });
  