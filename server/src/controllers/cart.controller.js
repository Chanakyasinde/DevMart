const mongoose = require("mongoose");

const User = require("../models/User");
const Product = require("../models/Product");
const AppError = require("../utils/AppError");

const getCart = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).populate({
      path: "cartItems.product",
      select: "name price imageUrl stock category"
    });

    if (!user) {
      return next(new AppError("User not found.", 404));
    }

    const cartItems = user.cartItems.filter((item) => item.product);
    const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    const subtotal = cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

    return res.status(200).json({
      success: true,
      data: {
        cartItems,
        summary: {
          totalItems,
          subtotal
        }
      }
    });
  } catch (error) {
    return next(error);
  }
};

const addToCart = async (req, res, next) => {
  try {
    const { productId, quantity = 1 } = req.body;

    if (!productId) {
      return next(new AppError("productId is required.", 400));
    }

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return next(new AppError("Invalid productId.", 400));
    }

    if (!Number.isInteger(quantity) || quantity < 1) {
      return next(new AppError("quantity must be a positive integer.", 400));
    }

    const product = await Product.findById(productId);
    if (!product) {
      return next(new AppError("Product not found.", 404));
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      return next(new AppError("User not found.", 404));
    }

    const existingItem = user.cartItems.find((item) => item.product.toString() === productId);

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      user.cartItems.push({
        product: productId,
        quantity
      });
    }

    await user.save();

    const updatedUser = await User.findById(user._id).populate({
      path: "cartItems.product",
      select: "name price imageUrl stock category"
    });

    const cartItems = updatedUser.cartItems.filter((item) => item.product);
    const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    const subtotal = cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

    return res.status(200).json({
      success: true,
      message: "Item added to cart successfully.",
      data: {
        cartItems,
        summary: {
          totalItems,
          subtotal
        }
      }
    });
  } catch (error) {
    return next(error);
  }
};

const removeFromCart = async (req, res, next) => {
  try {
    const { productId } = req.params;

    if (!productId) {
      return next(new AppError("productId is required.", 400));
    }

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return next(new AppError("Invalid productId.", 400));
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      return next(new AppError("User not found.", 404));
    }

    user.cartItems = user.cartItems.filter((item) => item.product.toString() !== productId);

    await user.save();

    const updatedUser = await User.findById(user._id).populate({
      path: "cartItems.product",
      select: "name price imageUrl stock category"
    });

    const cartItems = updatedUser.cartItems.filter((item) => item.product);
    const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    const subtotal = cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

    return res.status(200).json({
      success: true,
      message: "Item removed from cart successfully.",
      data: {
        cartItems,
        summary: {
          totalItems,
          subtotal
        }
      }
    });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  getCart,
  addToCart,
  removeFromCart
};
