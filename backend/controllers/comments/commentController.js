const expressAsyncHandler = require("express-async-handler");
const Comment = require("../../model/comment/Comment");
const validateMongodbId = require("../../utils/validateMongodbId");


//----------------------------
//Create
//---------------------------

const createCommentController = expressAsyncHandler(async (req,res)=>{
    //1.Get the user
    const user = req.user
    //2.Get the post id
    const { postId, description } = req.body;
    console.log(description)
    try {
        const comment = await Comment.create({
            post:postId,
            user:user,
            description,
            
        })
        res.json(comment);
    } catch (error) {
        res.json(error)
    }
    
    
});

//------------------------------------
//fetch all comments
//------------------------------------

const fetchAllCommentController = expressAsyncHandler(async (req,res) => {
    try {
        const comments = await Comment.find({}).sort("-created");
        res.json(comments)
    } catch (error) {
        res.json(error)
    }
});


//--------------------------------
// comment details
//---------------------------------

const fetchCommentController = expressAsyncHandler(async(req,res)=>{
    const {id} = req.params
    validateMongodbId(id);
    try {
        const comment = await Comment.findById(id);
        res.json(comment)
    } catch (error) {
        res.json(error)
    }
})

//----------------------------------
//Update
//---------------------------------


const updateCommentController = expressAsyncHandler(async (req,res)=>{
    const { id } = req.params;
    validateMongodbId(id);
    try {
        const update = await Comment.findByIdAndUpdate(
            id, 
            {
                post: req.body?.postId,
                user: req?.user,
                description: req?.body?.description,
        },
        {
            new: true,
            runValidators: true,
        });
        res.json(update)
    } catch (error) {
        res.json(error);
    }
})

//-------------------------------
//Delete
//-------------------------------

const deleteCommentController = expressAsyncHandler(async (req,res)=>{
    const { id } = req.params;
    validateMongodbId(id);
    try {
        const comment = await Comment.findByIdAndDelete(id);
        res.json(comment)
    } catch (error) {
        res.json(error);
    }
})

module.exports = { createCommentController,fetchAllCommentController,fetchCommentController,updateCommentController,deleteCommentController }