// middleware/auth.js
import jwt from 'jsonwebtoken';

const protect = (req, res, next) => {
  let token;

  // Check for token in the Authorization header
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Get token from header (Bearer <token>)
      token = req.headers.authorization.split(' ')[1];

      // Decode and verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Attach user to the request object (make sure your JWT contains the userId, name, and isAdmin)
      req.user = { 
        userId: decoded.userId, 
        name: decoded.name,
        isAdmin: decoded.isAdmin, // Add isAdmin to the request object
      };

      // Call the next middleware or route handler
      next();
    } catch (error) {
      console.error(error);
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }
};

export default protect;

