const mongoose = require("mongoose");

const Product = require("../models/Product");
const AppError = require("../utils/AppError");

const ensureDatabaseConnected = (next) => {
  if (mongoose.connection.readyState !== 1) {
    next(new AppError("Database is not connected. Add a valid MONGO_URI in server/.env.", 503));
    return false;
  }

  return true;
};

const getProducts = async (req, res, next) => {
  try {
    if (!ensureDatabaseConnected(next)) {
      return;
    }

    const products = await Product.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: products.length,
      data: {
        products
      }
    });
  } catch (error) {
    next(error);
  }
};

const getProductById = async (req, res, next) => {
  try {
    if (!ensureDatabaseConnected(next)) {
      return;
    }

    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return next(new AppError("Invalid product ID.", 400));
    }

    const product = await Product.findById(id);

    if (!product) {
      return next(new AppError("Product not found.", 404));
    }

    res.status(200).json({
      success: true,
      data: {
        product
      }
    });
  } catch (error) {
    next(error);
  }
};

const createProduct = async (req, res, next) => {
  try {
    if (!ensureDatabaseConnected(next)) {
      return;
    }

    const { name, description, price, imageUrl, category, stock } = req.body;

    if (!name || !description || price === undefined || !category) {
      return next(new AppError("Name, description, price, and category are required.", 400));
    }

    const product = await Product.create({
      name,
      description,
      price,
      imageUrl,
      category,
      stock,
      createdBy: req.user ? req.user._id : undefined
    });

    res.status(201).json({
      success: true,
      message: "Product created successfully.",
      data: {
        product
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProducts,
  getProductById,
  createProduct
};
