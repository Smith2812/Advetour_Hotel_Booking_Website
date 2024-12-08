const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ImageSchema = new Schema({
    url: String,
    filename: String
});


const RoomSchema = new Schema({
    title: String,
    bed: String, 
    size: Number,
    price: Number,
    amenities: [String],
    images: [ImageSchema],
    details:String
});

module.exports=mongoose.model("Room", RoomSchema);