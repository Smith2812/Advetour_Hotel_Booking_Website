const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const reviewSchema = new Schema({
    userType: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required:true
    },
    locationrating: {
        type: Number,
        required: true
    },
    roomrating: {
        type: Number,
        required: true
    },
    foodrating: {
        type: Number,
        required: true
    },
    cleanlinessrating: {
        type: Number,
        required: true
    },
    valueformoneyrating:{
        type:Number,
        required:true
    },
    content: {
        type: String,
        required: true
    },
    highlight:{
        type:String,
        required:true
    },
    rating:{
        type:Number,
        required:true
    },
    date:{
        type: String,
        required: true
    }
});

module.exports = mongoose.model("Review", reviewSchema);
