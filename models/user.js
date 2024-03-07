//models/user.js

const mongoose = require('mongoose');

// Define schema for the User model
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true // Ensure uniqueness of usernames
  },
  email: {
    type: String,
    required: true,
    unique: true, // Ensure uniqueness of emails
    lowercase: true, // Convert emails to lowercase before saving
    validate: {
      validator: function(v) {
        // Regular expression to validate email format
        return /^[\w-]+(?:\.[\w-]+)*@(?:[\w-]+\.)+[a-zA-Z]{2,7}$/.test(v);
      },
      message: props => `${props.value} is not a valid email address!`
    }
  },
  password: {
    type: String,
    required: true
  }
});

// Create User model based on the schema
const User = mongoose.model('User', userSchema);

module.exports = User;
