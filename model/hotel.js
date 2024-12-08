const mongoose = require('mongoose');
const hillstations = require('./hillstations');
const adventure = require('./adventure');
const pilgrimage = require('./pilgrimage');
const RoomSchema = require('./room')
const Schema = mongoose.Schema;

const ImageSchema = new Schema({
    url: String,
    filename: String
});




const hotelSchema = new Schema({
    title: String,
    brand:String,
    area: String,
    address: String,
    nearby: String,
    capacity: String,
    oldprice: Number,
    newprice: Number,
    category: String,
    view: String,
    images: [ImageSchema],
    rooms:[ {
        type: Schema.Types.ObjectId,
        ref: 'Room'
    }],
    rating: {
        type: Number,
        min: 1,
        max: 5
    },
    staycity: {
        type: Schema.Types.ObjectId,
        ref: 'Staycity'
    },
    beach:{
        type: Schema.Types.ObjectId,
        ref: 'Beach'
    },
    hillstation:{
        type: Schema.Types.ObjectId,
        ref: 'Hillstation'
    },
    adventure:{
        type: Schema.Types.ObjectId,
        ref: 'Adventure'
    },
    heritage:{
        type: Schema.Types.ObjectId,
        ref: 'Heritage'
    },
    pilgrimage:{
        type: Schema.Types.ObjectId,
        ref: 'Pilgrimage'
    },
    reviews:[ {
        type: Schema.Types.ObjectId,
        ref: 'Review'
    }],
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
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
    cancellation: {
        type:String,
    },
    meals:{
        type:String,
        enum:['No meals included','Free breakfast']
    },
    excellent:{
        type:Number,
        default:0
    },
    v_good:{
        type:Number,
        default:0
    },
    average:{
        type:Number,
        default:0
    },
    poor:{
        type:Number,
        default:0
    },
    bad:{
        type:Number,
        default:0
    }
});

module.exports = mongoose.model("Hotel", hotelSchema);
