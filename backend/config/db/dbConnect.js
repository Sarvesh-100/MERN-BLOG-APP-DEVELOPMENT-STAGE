const mongoose = require('mongoose');

const dbConnect = async ()=>{
try {
    await mongoose.connect(process.env.MONGODB_URL,{
        //useCreateIndex: true,
        //useFindAndModify: true,
        useUnifiedTopology: true,
        useNewUrlParser: true,
    });
    console.log("db is connected sucessfully")
} catch (error) {
    console.log(`Error ${error.message}`)
}
};

module.exports = dbConnect;