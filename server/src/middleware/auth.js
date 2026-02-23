const jwt = require("jsonwebtoken");
const User = require("../modules/user/user.model");
const AppError = require("../utils/AppError");


exports.protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return next(new AppError("Authentication required. Please log in.", 401));
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id);

    if (!user) {
      return next(new AppError("User not found or has been removed.", 401));
    }

    req.user = user;

    next();
  } catch (error) {
    return next(new AppError("Invalid or expired token.", 401));
  }
};


exports.restrictTo = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(new AppError("User information missing in request.", 500));
    }

    if (!allowedRoles.includes(req.user.role)) {
      return next(
        new AppError(
          `Access denied. ${req.user.role} role is not permitted to perform this action.`,
          403
        )
      );
    }

    next();
  };
};