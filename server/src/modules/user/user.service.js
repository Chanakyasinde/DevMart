const User = require("./user.model");
const AppError = require("../../utils/AppError");

const registerUser = async (data) => {
  const { name, email, password, role } = data;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new AppError("An account with this email already exists.", 400);
  }
  const user = await User.create({ name, email, password, role });
  return user;
};

const loginUser = async (data) => {
  const { email, password } = data;

  if (!email || !password) {
    throw new AppError("Email and password are required.", 400);
  }
  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    throw new AppError("Invalid email or password.", 401);
  }
  const isPasswordValid = await user.comparePassword(password);
  if (!isPasswordValid) {
    throw new AppError("Invalid email or password.", 401);
  }
  return user;
};

const getUserProfile = async (userId) => {
  const user = await User.findById(userId)
    .populate("purchasedAssets", "title price");

  if (!user) {
    throw new AppError("User not found.", 404);
  }

  return user;
};

const updateUserProfile = async (userId, updates) => {
  const allowedFields = ["name", "bio", "avatar"];

  const filteredUpdates = {};

  allowedFields.forEach((field) => {
    if (field in updates) {
      filteredUpdates[field] = updates[field];
    }
  });
  const updatedUser = await User.findByIdAndUpdate(
    userId,
    filteredUpdates,
    {
      new: true,
      runValidators: true
    }
  );

  if (!updatedUser) {
    throw new AppError("User not found.", 404);
  }
  return updatedUser;
};

module.exports = { registerUser, loginUser, getUserProfile, updateUserProfile };