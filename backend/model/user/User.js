const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
//create schema 

const userSchema = new mongoose.Schema(
    {
        firstName: {
        required: [true,'First Name is required'],
        type: String,
    },
    lastName: {
        required: [true,'Last Name is required'],
        type: String,
    },
    profilePhoto:{
        type: String,
        default:'https://cdn.pixabay.com/photo/2013/07/13/12/07/avatar-159236_960_720.png',
    },
    email:{
        type:String,
        required :[true,'Email is required'],
    },
    bio:{
        type:String,
    },
    password :{
        type:String,
        required : [true,'Password is required'],
    },
    postCount :{
        type: Number,
        default: 0 ,
    },
    isBlocked :{
        type:Boolean,
        default:false,
    },
    isAdmin :{
        type:Boolean,
        default:false,
    },
    role:{
        type:String,
        enum:["Admin","Guest","Blogger"],
    },
    isFollowing:{
        type:Boolean,
        default:false,
    },
    isunFollowing:{
        type:Boolean,
        default:false,
    },
    isAccountVerified:{
        type :Boolean,
        default:false,
    },
    accountVerificationToken:{
        type:String,
    },
    accountverificationTokenExpires: {
        type:Date,
    },
    viewedBy:{
        type:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref:"User",
        }
        ],
    },
    
    followers:{
        type:[
            {
                type: mongoose.Schema.Types.ObjectId,
                ref:"User",
            }
            ],
    },
    following:{
        type:[
            {
                type: mongoose.Schema.Types.ObjectId,
                ref:"User",
            }
            ],
    },
    passwordChangeAt:{
        type:Date,
    },
    passwordResetToken:{
        type:String,
    },
    paasswordResetExpires:{
        type:Date,
    },
    active: {
        type:Boolean,
        default:false,
    },
},
{
    toJSON:{
        virtuals:true,
    },
    toObject:{
        virtuals:true,
    },
    timestamps:true,
}
);

//virtual method to populate created post
userSchema.virtual('posts',{
    ref:'post',
    foreignField:'user',
    localField:'_id',
})

//Hash password
userSchema.pre("save", async function(next){
    if(!this.isModified("password")){
        next();
    }
    //hash password
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});


//Match password
userSchema.methods.isPasswordMatched = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword,this.password)
}

//compile schema into model
const User = mongoose.model('User',userSchema);

module.exports = User; 