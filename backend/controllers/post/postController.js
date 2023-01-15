const Post = require("../../model/post/Post");
const expressAsyncHandler = require("express-async-handler");
const validateMongodbId = require("../../utils/validateMongodbId");
const Filter = require('bad-words');
const fs = require("fs");
const User = require("../../model/user/User");
const cloudinaryUploadImg = require("../../utils/cloudinary");

//---------------------------------------------
//CREATE POST
//--------------------------------------------

const createpostController = expressAsyncHandler(async (req,res)=>{
    console.log(req.file)
    const { _id } = req.user;
    //validateMongodbId(req.body.user);
    //Check for bad words
    const filter = new Filter();
    const isProfane = filter.isProfane(req.body.title,req.body.description);
    //Block user
    if(isProfane) {
        
        await User.findByIdAndUpdate( _id, {
            isBlocked:true,
        });
        throw new Error(
        "Creating Failed Because it contain profane words and you have been blocked"
        );
    }
    
    //1. Get the path to the image
    //const localPath = `public/images/posts/${req.file.filename}`;
    //2.Upload to cloudinary
    //const imgUploaded = await  cloudinaryUploadImg(localPath);
    
        try {
            const post = await Post.create({
            ...req.body,
            user:_id,
            });
            res.json(post);
            //Remove Uploaded Images
            //fs.unlinkSync(localPath)
    } catch (error) {
        res.json(error);
    }
});

//-------------------------------------
//Fetch all posts
//------------------------------------
const fetchPostsController = expressAsyncHandler(async (req,res)=>{
    try {
        const posts = await Post.find({}).populate('user')
        res.json(posts);
    } catch (error) {
        res.json(error)
    }
    
});

//--------------------------------
//Fetch a single post
//-------------------------------

const fetchPostController = expressAsyncHandler( async (req,res)=>{
    const { id }= req.params;
    validateMongodbId(id);
    try {
        const post = await Post.findById(id).populate("user").populate("dislikes").populate("likes");
        //update number of views
        await Post.findByIdAndUpdate(id,{
            $inc:{numViews: 1},
        },{new:true});
        res.json(post)
    } catch (error) {
        res.json(error)
    }
})

//------------------------------------
//Update post
//------------------------------------

const updatePostController = expressAsyncHandler(async(req,res)=>{
    console.log(req.user)
    const { id } = req.params;
    validateMongodbId(id)
    
    try {
        const post = await Post.findByIdAndUpdate(
            id,
            {
                ...req.body,
                user:req.user?._id,
            },
            {
                new:true
            }
        ); 
        res.json(post)
    } catch (error) {
        res.json(error);
    }
});

//-------------------------
//Delete Post
//------------------------

const deletePostController = expressAsyncHandler(async(req,res)=>{
    const{id} = req.params;
    validateMongodbId(id)
    try {
        const post = await Post.findByIdAndDelete(id);
        res.json(post)
    } catch (error) {
        res.json("Delete")
    }    
});
//------------------------
//Likes
//------------------------

const toggleAddLikePostController = expressAsyncHandler(async (req,res)=>{
    
    //1.Find the post to be liked
    const { postId } = req.body
    const post = await Post.findById(postId)
    //2. Find the login user
    const loginUserId = req?.user?._id;
    //3. Find if  this user has liked this post
    const isLiked = post?.isLiked;
    //4. Check if this user has disliked this post
    const alreadyDisliked = post?.dislikes?.find(
        userId => userId?.toString() === loginUserId?.toString()
        );
    //5. remove the user from dislikes array if exists
    if(alreadyDisliked){
        const post = await Post.findByIdAndUpdate(
            postId,
            {
                $pull:{ dislikes: loginUserId },
                isDisLiked:false,
        },
        {new:true}
        );
        res.json(post);
    }
    //Toggle
    //Remove the user if he has liked the post
    if(isLiked){
        const post = await Post.findByIdAndUpdate(
            postId,
            {
                $pull:{ likes : loginUserId },
                isLiked:false,
            },
            {new:true}
            );
            res.json(post);
    }else {
       //add to likes
        const post = await Post.findByIdAndUpdate(postId,{
            $push:{likes:loginUserId},
            isLiked:true,
        },{
            new:true
        });
        res.json(post)
    }
    
});

//--------------------
//dislikes
//---------------------

const toggleAddDislikeToPostController = expressAsyncHandler(async (req,res)=>{
    //1.Find th post to be disliked
    const { postId } = req.body;
    const post = await Post.findById(postId);
    //2.find the login user
    const loginUserId = req?.user?._id
    //3. Check if this user has already disliked
    const isDisLiked = post?.isDisLiked;
    //4. Check if already like this post
    const alreadyLiked = post?.likes?.find(
        userId => userId.toString() === loginUserId?.toString()
    );
    //Remove this user from likes array if it exists
    if(alreadyLiked){
        const post = await Post.findByIdAndUpdate(postId,{
            $pull:{likes: loginUserId},
            isLiked:false,
        },
        {new:true}
        );
        res.json(post)
    }
    //Toggling
    //Remove this user from dislikes if already disliked
    if(isDisLiked){
        const post = await Post.findByIdAndUpdate(postId,{
            $pull:{dislikes: loginUserId},
            isDisLiked:false,
        },{new:true}
        );
        res.json(post);    
    }else{
        const post = await Post.findByIdAndUpdate(postId,{
            $push:{dislikes: loginUserId},
            isDisLiked:true,
        },{
            new:true
        });
        res.json(post)
    }
    
});

module.exports ={ createpostController,fetchPostsController,fetchPostController,updatePostController,deletePostController,toggleAddLikePostController,toggleAddDislikeToPostController }