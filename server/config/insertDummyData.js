// insertDummyData.js

const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const User = require('../models/User');
const Listing = require('../models/Listing');
const Review = require('../models/Review');
const Payment = require('../models/Payment');
const Amenity = require('../models/Amenity');

// Function to read JSON file
function readJSONFile(filename) {
  const rawData = fs.readFileSync(path.join(__dirname, filename));
  return JSON.parse(rawData);
}

// Function to replace string IDs with ObjectIds
function replaceIds(obj, idMap) {
  if (Array.isArray(obj)) {
    return obj.map(item => replaceIds(item, idMap));
  } else if (typeof obj === 'object' && obj !== null) {
    const newObj = {};
    for (const [key, value] of Object.entries(obj)) {
      if (key === '_id' || key.endsWith('_id')) {
        newObj[key] = idMap.get(value) || value;
      } else if (Array.isArray(value) && value.every(item => typeof item === 'string')) {
        // Handle arrays of string IDs
        newObj[key] = value.map(id => idMap.get(id) || id);
      } else {
        newObj[key] = replaceIds(value, idMap);
      }
    }
    return newObj;
  }
  return obj;
}

async function insertDummyData(connection) {
  try {
    // Read the JSON data from file
    const data = readJSONFile('dummyData.json');

    // Clear existing data
    await User.deleteMany({});
    await Listing.deleteMany({});
    await Review.deleteMany({});
    await Payment.deleteMany({});
    await Amenity.deleteMany({});

    console.log('Existing data cleared.');

    // Create a map to store new ObjectIds
    const idMap = new Map();

    // Generate new ObjectIds for all documents
    ['amenities', 'users', 'listings', 'reviews', 'payments'].forEach(collection => {
      data[collection].forEach(item => {
        const newId = new mongoose.Types.ObjectId();
        idMap.set(item._id, newId);
      });
    });

    // Replace all string IDs with ObjectIds
    const processedData = replaceIds(data, idMap);

    // Insert data
    await Amenity.insertMany(processedData.amenities);
    console.log('Amenities inserted.');

    await User.insertMany(processedData.users);
    console.log('Users inserted.');

    await Listing.insertMany(processedData.listings);
    console.log('Listings inserted.');

    await Review.insertMany(processedData.reviews);
    console.log('Reviews inserted.');

    await Payment.insertMany(processedData.payments);
    console.log('Payments inserted.');

    console.log('All dummy data inserted successfully.');
  } catch (error) {
    console.error('Error inserting dummy data:', error);
  }
}

module.exports = insertDummyData;