const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const dbConnect = require('./config/db/dbConnect');
const userRoutes = require('./route/users/usersRoute');
const { errorHandler, notFound } = require('./middlewares/error/errorHandler');
const postRoute = require('./route/posts/postRoute');
const commentRoute = require('./route/comments/commentsRoute');
const categoryRoute = require('./route/category/categoryRoute');



dotenv.config();


const app = express();
dbConnect();

//Middlewear
app.use(express.json());
//cors
app.use(cors());



//Users Route
app.use('/api/users',userRoutes);
//post Route
app.use("/api/post",postRoute)
//comment Route
app.use("/api/comment",commentRoute)
//category Route
app.use("/api/category",categoryRoute)

//error Handler
app.use(notFound)
app.use(errorHandler)
//server
const PORT = process.env.PORT || 3000; 
app.listen(PORT,console.log(`server is running${PORT}`));

