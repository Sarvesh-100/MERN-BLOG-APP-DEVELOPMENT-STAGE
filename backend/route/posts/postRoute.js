const express = require('express');
const { createpostController, fetchPostsController,fetchPostController, updatePostController,deletePostController,toggleAddLikePostController,toggleAddDislikeToPostController } = require('../../controllers/post/postController');
const authMiddleware = require('../../middlewares/auth/authMiddleware');
const { PhotoUplaod, postImageResize, } = require('../../middlewares/uploads/PhotoUpload');
const postRoute = express.Router();


postRoute.post("/",authMiddleware,PhotoUplaod.single('image'),postImageResize,createpostController)

postRoute.get('/',fetchPostsController)

postRoute.put('/likes',authMiddleware,toggleAddLikePostController)
postRoute.put('/dislikes',authMiddleware,toggleAddDislikeToPostController)
postRoute.get('/:id',fetchPostController)
postRoute.put('/:id',authMiddleware,updatePostController)
postRoute.delete('/:id',authMiddleware,deletePostController)


module.exports = postRoute