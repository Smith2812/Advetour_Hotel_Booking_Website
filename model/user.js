const mongoose=require('mongoose');
const Schema=mongoose.Schema;
const passportLocalMongoose=require('passport-local-mongoose')

const ImageSchema=new Schema({
    url:String,
    filename:String
})

const bookschema=new Schema({
    checkin:String,
    checkout:String,
    people:Number,
    payment:Number,
    hotel:String
});




const UserSchema=new Schema({
    email:{
        type:String,
        required:true,
        unique:true
    },
    image:ImageSchema,
    userType: {
        type: String,
        enum: ['Regular User', 'Property Owner', 'Admin'],
        required: true
    },
    Booking:[bookschema]
});


UserSchema.plugin(passportLocalMongoose);

module.exports=mongoose.model('User',UserSchema);