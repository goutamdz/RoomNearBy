
const mongoose = require('mongoose');
const initData = require('./data.js');
const list = require('../models/list.js');

mongoose.connect("mongodb+srv://Goutam:Admin@cluster0.xdzxz20.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")//will not work now
    .then(() => {
        console.log("Database connected successfully!");
    })
    .catch((err) => {
        console.error("Database connection error:", err.message);
    });

const initDb = async () => {
    try {
        await list.deleteMany({});
        
        // Ensure initData.data is correctly populated
        initData.data = initData.data.map((obj) => ({
            ...obj,
            owner: '66b12418728e4702b7f1cfba',
            phoneNumber: "+91 xxxxxxxxx",
            Email: "demo@gmail.com"
        }));
        
        await list.insertMany(initData.data);
        console.log("Data inserted successfully!");
    } catch (err) {
        console.error("Data insertion error:", err.message);
    }
};

initDb();
