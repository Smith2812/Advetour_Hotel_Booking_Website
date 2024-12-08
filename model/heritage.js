const mongoose=require('mongoose');
const Schema=mongoose.Schema;


const ImageSchema=new Schema({
    url:String,
    filename:String
})



const Heritageschema=new Schema({
    title:String,
    location:String,
    images:[ImageSchema],
    geometry:{
        type:{
            type:String,
            enum:['Point'],
            required:true
        },
        coordinates:{
            type:[Number],
            required:true
        }
    },
    hotels:[
        {
            type:Schema.Types.ObjectId,
            ref:'Hotel'
        }
    ],
    admin:{
        type:Schema.Types.ObjectId,
        ref:'User'
    }
})



module.exports=mongoose.model('Heritage',Heritageschema);

