const mongoose = require('mongoose');



const postSchema = new mongoose.Schema({
    title:{
        type: String,
        required:[true,'post category is required'],
        trim: true,
    },
    //Create by only category
    category:{
        type:String,
        required:[true,'post category is required'],
        default:"All"
    },
    isLiked:{
        type:Boolean,
        default:false,
    },
    isDisLiked:{
        type:Boolean,
        default:false,
    },
    numViews: {
        type:Number,
        default: 0,
    },
    likes:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"User",

        },
    ],
    dislikes:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"User",

        },
    ],
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:[true,"Please Author is required"]
    },
    description:{
        type:String,
        required:[true,"Post description is required"]
    },
    image:{
        type:String,
        default:"https://cdn.pixabay.com/photo/2022/06/29/05/12/italy-7290977_640.jpg"
    }
},{
    toJSON:{
        virtuals:true
    },
    toObject:{
        virtuals:true,
    },
    timestamps:true,
});

//compile
const Post = mongoose.model('post',postSchema);


module.exports = Post;