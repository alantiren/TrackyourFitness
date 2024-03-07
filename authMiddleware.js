// authMiddleware.js
const jwt = require('jsonwebtoken');
const User = require('./models/user'); // Import the User model

// Middleware function to authenticate incoming requests
async function authenticate(req, res, next) {
  try {
    // Extract the token from the request headers
    const token = req.headers.authorization.split(' ')[1];

    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Find the user based on the decoded token
    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    // Attach the user information to the request object
    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
}

module.exports = authenticate;
