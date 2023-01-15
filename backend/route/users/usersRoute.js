const express = require('express');
const { userRegsiterController, loginUserController, fetchUsersController,deleteUsersController, fetchUserDetailsController, userprofileController, updateUserController,updateUserPasswordController,followingUserController,unfollowUserController,blockUserController,unBlockUserController,profilePhotoUploadController } = require('../../controllers/users/usersController');
const authMiddleware = require('../../middlewares/auth/authMiddleware');
const { PhotoUplaod,profilePhotoResize } = require('../../middlewares/uploads/PhotoUpload');


const userRoutes = express.Router();


userRoutes.post("/register",userRegsiterController);
userRoutes.post("/login",loginUserController);
userRoutes.get("/",authMiddleware,fetchUsersController);
userRoutes.get("/profile/:id",authMiddleware,userprofileController);
userRoutes.put('/follow',authMiddleware,followingUserController);
userRoutes.put('/unfollow',authMiddleware,unfollowUserController);
userRoutes.put('/profilephoto-upload',authMiddleware,PhotoUplaod.single('image'),profilePhotoResize,profilePhotoUploadController);
userRoutes.put('/block-user/:id',authMiddleware,blockUserController);
userRoutes.put('/unblock-user/:id',authMiddleware,unBlockUserController);
userRoutes.put('/:id',authMiddleware,updateUserController);
userRoutes.put('/password',authMiddleware,updateUserPasswordController);
userRoutes.delete("/:id",deleteUsersController);
userRoutes.get("/:id",fetchUserDetailsController);



module.exports = userRoutes;