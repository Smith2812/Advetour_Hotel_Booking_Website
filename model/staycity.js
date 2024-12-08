const mongoose=require('mongoose');
const Schema=mongoose.Schema;


const ImageSchema=new Schema({
    url:String,
    filename:String
})



// ImageSchema.virtual('thumbnail').get(function(){
//     return this.url.replace('/upload', '/upload/w_200');
// })

// const opts={toJSON:{virtuals:true}};

const StaycitySchema=new Schema({
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



module.exports=mongoose.model('Staycity',StaycitySchema);

