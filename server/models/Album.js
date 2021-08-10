const { Schema } = require('mongoose');

// This is a subdocument schema, it won't become its own model but we'll use it as the schema for the User's `savedAlbums` array in User.js
const albumSchema = new Schema({
  albumId: {
    type: String,
    required: true,
  },
 
  title: {
    type: String,
    required: true,
  },
} , { _id: false } );

module.exports = albumSchema;





// const { Schema } = require('mongoose');

// // This is a subdocument schema, it won't become its own model but we'll use it as the schema for the User's `savedAlbums` array in User.js
// const albumSchema = new Schema({
//   albumId: {
//     type: String,
//     required: true,
//   },
 
//   title: {
//     type: String,
//     required: true,
//   },
// });

// module.exports = albumSchema;
