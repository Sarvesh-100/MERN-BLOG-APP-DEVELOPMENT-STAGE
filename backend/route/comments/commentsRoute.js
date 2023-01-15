const express = require('express');
const { createCommentController,fetchAllCommentController,fetchCommentController,updateCommentController,deleteCommentController } = require('../../controllers/comments/commentController');
const authMiddleware = require('../../middlewares/auth/authMiddleware');
const commentRoute = express.Router()



commentRoute.post("/",authMiddleware,createCommentController)

commentRoute.get("/",authMiddleware,fetchAllCommentController)

commentRoute.get("/:id",authMiddleware,fetchCommentController)

commentRoute.put("/:id",authMiddleware,updateCommentController)

commentRoute.delete("/:id",authMiddleware,deleteCommentController)

module.exports = commentRoute;