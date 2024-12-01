const cloudinary = require("cloudinary").v2;

cloudinary.config({
    cloud_name: "darylb",
    api_key: process.env.cloudinary_api_key,
    api_secret: process.env.cloudinary_api_secret,
    secure: true,
  });

module.exports = {cloudinary};