const express = require('express');
const { createCategoryController,fetchCategorysController,fetchCategoryController,updateCategoryController,deleteCategoryController } = require('../../controllers/category/categoryController');
const authMiddleware = require('../../middlewares/auth/authMiddleware');
const categoryRoute = express.Router();



categoryRoute.post("/",authMiddleware,createCategoryController);

categoryRoute.get("/",authMiddleware,fetchCategorysController);

categoryRoute.get("/:id",authMiddleware,fetchCategoryController);

categoryRoute.put("/:id",authMiddleware,updateCategoryController);

categoryRoute.delete("/:id",authMiddleware,deleteCategoryController);



module.exports = categoryRoute;