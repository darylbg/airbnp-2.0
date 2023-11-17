const mongoose = require("mongoose");
require('dotenv').config();

const mongoDB_uri_password = process.env.MONGODB_URI_PASSWORD

mongoose
  .connect(`mongodb+srv://darylxcuf:${mongoDB_uri_password}@airbnp-2.6pvtukc.mongodb.net/?retryWrites=true&w=majority`)
  .then(() => {
    console.log("connected to the database");
  })
  .catch((error) => {
    console.log(`Mongoose error: ${error}`);
  });

module.exports = mongoose.connection;
