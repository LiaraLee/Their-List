// middleware/roles.js
// middleware/roles.js

// Define user roles
const roles = {
    ADMIN: 'admin',   // Admin role has the highest privileges
    USER: 'user',     // Regular user role has limited privileges
    GUEST: 'guest',   // Guest role has very limited access (mostly view-only)
  };
  
  // Define role-based permissions
  const permissions = {
    [roles.ADMIN]: [
      'view_all_orders',      // Can view all orders
      'modify_all_orders',    // Can modify any order
      'view_user_data',       // Can view user data
      'manage_users',         // Can manage user accounts
      'update_order_status',  // Can update the status of any order
    ],
    [roles.USER]: [
      'view_own_orders',      // Can view only their own orders
      'place_orders',         // Can place new orders
      'modify_own_orders',    // Can modify only their own orders
    ],
    [roles.GUEST]: [
      'browse_app',           // Can browse the app, but can't perform actions like placing orders
    ],
  };
  
  // Utility function to check if a user has a specific permission
  const hasPermission = (role, permission) => {
    return permissions[role]?.includes(permission);
  };
  
  // Utility function to check if a user has a specific role
  const hasRole = (role, requiredRole) => {
    return role === requiredRole;
  };

  // Middleware to check if the user is an admin
const adminOnly = (req, res, next) => {
  if (!req.user || req.user.isAdmin !== true) {
    return res.status(403).json({ message: 'Access denied. Admins only.' });
  }
  next();
};

// Middleware to check for specific permissions
const requirePermission = (permission) => (req, res, next) => {
  const userRole = req.user?.isAdmin ? roles.ADMIN : roles.USER;

  if (!hasPermission(userRole, permission)) {
    return res.status(403).json({ message: `Permission "${permission}" denied.` });
  }

  next();
};

export { roles, permissions, hasPermission, hasRole, adminOnly, requirePermission };
