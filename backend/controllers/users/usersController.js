const expressAsyncHandler = require("express-async-handler");
const fs = require("fs");
const generateToken = require("../../config/token/generateToken");
const User = require("../../model/user/User");
const cloudinaryUploadImg = require("../../utils/cloudinary");
const validateMongodbId = require("../../utils/validateMongodbId");





//------------------------------
//Register
//------------------------------


const userRegsiterController = expressAsyncHandler(
    async (req,res)=>{
        //Check if user Exists
        const userExists = await User.findOne({ email:req?.body?.email })
    
        if (userExists) throw new Error("User already exists")
        try {
        //register user
        const user = await User.create({
            firstName:req?.body?.firstName,
            lastName:req?.body?.lastName,
            email:req?.body?.email,
            password:req?.body?.password,
        });
        res.json(user);
        } catch (error) {
            res.json(error);
        }
        
    });

    //-----------------------------
    //Login user
    //-----------------------------

    const loginUserController = expressAsyncHandler(async (req,res)=>{
        const {email,password} = req.body;  
        //check if user exists
        const userFound = await User.findOne({ email });
        //check if password is match
        
        if(userFound && (await userFound.isPasswordMatched(password))){
            res.json({
                _id:userFound?._id,
                firstName: userFound?.firstName,
                lastName: userFound?.lastName,
                email:userFound?.email,
                profilePhoto: userFound?.profilePhoto,
                isAdmin: userFound?.isAdmin,
                token:generateToken(userFound?._id)
            });
        }else{
            res.status(401)
            throw new Error("Invalid Login credentials")
        }
    });


    
//---------------------
//Users
//---------------------
const fetchUsersController = expressAsyncHandler(async (req,res)=>{
    console.log(req.headers)
    try {
        const users = await User.find({})
        res.json(users)
    } catch (error) {
        res.json(error)
    }
})

//-----------------
//Delete user
//-----------------

const deleteUsersController = expressAsyncHandler(async (req,res)=>{
    const { id } = req.params;
    //check if user id is valid
    validateMongodbId(id);
    try {
        const deletedUser = await User.findByIdAndDelete(id);
        res.json(deletedUser);
    } catch (error) {
        res.json(error) 
    }
});

//---------------
//user details
//---------------


const fetchUserDetailsController = expressAsyncHandler(async (req,res)=>{
    const{ id } = req.params;
    //check if user is is valid
    validateMongodbId(id);
    try {
        const user = await User.findById(id);
        res.json(user);
    } catch (error) {
        res.json(error);
    }
});

//--------------
//User profile
//--------------

const userprofileController = expressAsyncHandler(async (req,res)=>{
    const { id } = req.params;
    validateMongodbId(id);
    try {
        const myProfile = await User.findById(id).populate('posts')
        res.json(myProfile)
    } catch (error) {
        res.json(error)
    }
})

//--------------
//update profile
//---------------
const updateUserController = expressAsyncHandler(async(req ,res) =>{
    const {_id} = req?.user;
    validateMongodbId(_id)

    const user = await User.findByIdAndUpdate(_id ,{
        firstName : req?.body?.firstName,
        lastName : req?.body?.lastName, 
        email : req?.body?.email ,
        bio : req?.body?.bio
    },{
        new :true,
        runValidators : true
    })
    console.log(user);
    res.json(user)
})


//--------------------
//update password
//-------------------

const updateUserPasswordController = expressAsyncHandler(async (req,res)=>{
  //destructure the login user
    const { _id } = req.user;
    const { password }= req.body
    validateMongodbId(_id);
    //find the user by id
    const user = await User.findById(_id)

    if(password){
        user.password = password;
        const updatedUser = await user.save();
        res.json(updatedUser);
    }else{
    res.json(user)
    }
})

//-------------------
//following
//-------------------

const followingUserController = expressAsyncHandler(async (req,res)=>{
    //1.Find the user you want to follow and update its follower field
    //2.Update the login user following field
    const { followId } = req.body;
    const loginUserId = req.user.id;

    //find the target user and check if the login id exist
    const targetUser = await User.findById(followId)
    
    const alreadyFollowing = targetUser?.followers?.find(user => user?.toString()===loginUserId.toString());

    if(alreadyFollowing) throw new Error("you have already followed this user")


    //1.Find the user you want to follow and update its follower field
    await User.findByIdAndUpdate(followId,
        {
            $push:{followers:loginUserId},
            isFollowing:true,
        },
        {new:true}
    );

    //2.Update the login user following field
    await User.findByIdAndUpdate(loginUserId,
        {

        $push:{following:followId},

        },
        {new:true}
    );



    res.json("you have sucessfully follow this user")
});



//-------------------
//unfollow
//-------------------

const unfollowUserController = expressAsyncHandler(async (req,res)=>{
    const {unFollowId} = req.body;
    const loginUserId = req.user.id;
    
    await User.findByIdAndUpdate(unFollowId,{
        $pull:{followers:loginUserId},
        isFollowing:false
    },{new:true});

    await User.findByIdAndUpdate(loginUserId,{
        $pull:{following:unFollowId}
    },
    {new:true}
    );

    res.json('you have sucessfully unfollow this user')
});

//-----------------
//Block user
//-----------------  

const blockUserController = expressAsyncHandler(async (req,res) => {
    const { id } = req.params;
    validateMongodbId(id);

    const user = await User.findByIdAndUpdate(id,{
        isBlocked:true,
    },
    {new:true}
    );
    res.json(user)
});


//-----------------
//unBlock user
//-----------------  

const unBlockUserController = expressAsyncHandler(async (req,res) => {
    const { id } = req.params;
    validateMongodbId(id);

    const user = await User.findByIdAndUpdate(id,{
        isBlocked:false,
    },
    {new:true}
    );
    res.json(user)
});

//----------------------
//Profile photo upload
//----------------------

const profilePhotoUploadController = expressAsyncHandler(async (req,res)=>{
    //Find the login user
    const { _id} =req.user
    
    
    
    //1. Get the path to the image
    const localPath = `public/images/profile/${req.file.filename}`;
    //2.Upload to cloudinary
    const imgUploaded = await  cloudinaryUploadImg(localPath);

    const foundUser = await User.findByIdAndUpdate(
        _id,
        {
        profilePhoto:imgUploaded?.url,
    },
    { new: true }
    );
    //Remove the saved img
    fs.unlinkSync(localPath);
    res.json(imgUploaded);
});




module.exports ={ userRegsiterController,loginUserController,fetchUsersController,deleteUsersController,fetchUserDetailsController,userprofileController,updateUserController,updateUserPasswordController,followingUserController,unfollowUserController,blockUserController,unBlockUserController,profilePhotoUploadController }