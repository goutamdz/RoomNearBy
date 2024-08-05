const mongoose=require('mongoose');

const connect = function () {

    mongoose.connect(process.env.MONGO_URL)
        .then(() => {
            console.log("Database connected successfully! ");
        })
        .catch((err) => {
            console.log(err.message);
        })
}

module.exports=connect;