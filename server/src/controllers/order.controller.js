const mongoose = require("mongoose");

const AppError = require("../utils/AppError");
const User = require("../models/User");
const Product = require("../models/Product");
const Order = require("../models/Order");

const createOrder = async (req, res, next) => {
  try {
    const { shippingAddress, paymentMethod } = req.body;

    if (!shippingAddress) {
      return next(new AppError("shippingAddress is required.", 400));
    }

    const requiredAddressFields = ["fullName", "addressLine1", "city", "state", "postalCode", "country"];
    const missingField = requiredAddressFields.find((field) => !shippingAddress[field]);

    if (missingField) {
      return next(new AppError(`shippingAddress.${missingField} is required.`, 400));
    }

    if (!paymentMethod) {
      return next(new AppError("paymentMethod is required.", 400));
    }

    const user = await User.findById(req.user._id).populate({
      path: "cartItems.product",
      model: "Product"
    });

    if (!user) {
      return next(new AppError("User not found.", 404));
    }

    if (!user.cartItems || user.cartItems.length === 0) {
      return next(new AppError("Cart is empty. Add items before creating an order.", 400));
    }

    const cleanedCartItems = user.cartItems.filter((item) => item.product);
    if (cleanedCartItems.length === 0) {
      return next(new AppError("Cart contains invalid items. Please re-add products.", 400));
    }

    for (const item of cleanedCartItems) {
      if (item.quantity > item.product.stock) {
        return next(
          new AppError(
            `Insufficient stock for ${item.product.name}. Available: ${item.product.stock}, requested: ${item.quantity}.`,
            400
          )
        );
      }
    }

    const orderItems = cleanedCartItems.map((item) => ({
      product: item.product._id,
      name: item.product.name,
      imageUrl: item.product.imageUrl,
      price: item.product.price,
      quantity: item.quantity
    }));

    const totalAmount = orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

    const session = await mongoose.startSession();

    let createdOrder;
    try {
      await session.withTransaction(async () => {
        for (const item of orderItems) {
          await Product.findByIdAndUpdate(
            item.product,
            { $inc: { stock: -item.quantity } },
            { session }
          );
        }

        const orders = await Order.create(
          [
            {
              user: user._id,
              orderItems,
              shippingAddress,
              paymentMethod,
              totalAmount
            }
          ],
          { session }
        );

        createdOrder = orders[0];

        await User.findByIdAndUpdate(user._id, { $set: { cartItems: [] } }, { session });
      });
    } finally {
      session.endSession();
    }

    const populatedOrder = await Order.findById(createdOrder._id)
      .populate("user", "name email")
      .populate("orderItems.product", "name imageUrl category");

    return res.status(201).json({
      success: true,
      message: "Order created successfully.",
      data: {
        order: populatedOrder
      }
    });
  } catch (error) {
    return next(error);
  }
};

const getMyOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .populate("orderItems.product", "name imageUrl category")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: orders.length,
      data: {
        orders
      }
    });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  createOrder,
  getMyOrders
};
