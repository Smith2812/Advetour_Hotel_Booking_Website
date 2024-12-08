const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const bookschema=new Schema({
    checkin:String,
    checkout:String,
    people:Number,
    payment:Number,
    hotel:String
}

)

module.exports = mongoose.model('Book',bookschema)

