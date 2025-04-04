// middleware/auth.js
import jwt from 'jsonwebtoken';

const protect = (req, res, next) => {
  // Get the token from the Authorization header, expecting format "Bearer <token>"
  const token = req.headers.authorization?.split(' ')[1];

  // If no token, return 401 (Unauthorized)
  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  try {
    // Verify the token with the secret key
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach both userId and name from the decoded token to the request object
    req.user = { userId: decoded.userId, name: decoded.name };

    // Call the next middleware or route handler
    next();
  } catch (err) {
    console.error(err);
    // If token verification fails, return 401 (Unauthorized)
    res.status(401).json({ message: 'Token is not valid' });
  }
};

export default protect;
