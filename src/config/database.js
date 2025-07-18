
const mongoose = require("mongoose");

const connectDB = async () => {
    await mongoose.connect(
    "mongodb+srv://prakashmaddi:seCUSYF7Pw8PwHTP@namastenode.ft781go.mongodb.net/devTinder"     // refering to the cluster
    );
};


module.exports = {
   connectDB,
};