const Product = require("./product.model");
const AppError = require("../../utils/AppError");

const createProduct = async (data, sellerId) => {
  return await Product.create({
    ...data,
    seller: sellerId,
  });
};

const getAllProducts = async (query) => {
  const { search, category, minPrice, maxPrice, sort, page = 1, limit = 12 } = query;
  const pageNumber = parseInt(page, 10);
  const limitNumber = parseInt(limit, 10);

  const filter = {
    isApproved: true,
    isActive: true,
  };

  if (search) {
    filter.$text = { $search: search };
  }

  if (category) {
    filter.category = category;
  }

  if (minPrice || maxPrice) {
    filter.price = {};
    if (minPrice) filter.price.$gte = parseFloat(minPrice);
    if (maxPrice) filter.price.$lte = parseFloat(maxPrice);
  }

  const sortMap = {
    price_asc: "price",
    price_desc: "-price",
    popular: "-downloads",
    rating: "-ratingsAverage",
  };

  const sortOption = sortMap[sort] || "-createdAt";
  const skip = (pageNumber - 1) * limitNumber;
  const total = await Product.countDocuments(filter);

  const products = await Product.find(filter)
    .populate("seller", "name avatar")
    .select("-fileUrl")
    .sort(sortOption)
    .skip(skip)
    .limit(limitNumber);

  return {
    products,
    pagination: {
      total,
      page: pageNumber,
      pages: Math.ceil(total / limitNumber),
    }
  };
};

const getProductById = async (productId) => {
  const product = await Product.findById(productId)
    .populate("seller", "name avatar bio")
    .select("-fileUrl");

  if (!product) {
    throw new AppError("Product not found", 404);
  }

  return product;
};

const getSellerProducts = async (sellerId) => {
  return await Product.find({ seller: sellerId }).sort("-createdAt");
};

const updateProduct = async (productId, sellerId, updateData) => {
  const product = await Product.findOne({
    _id: productId,
    seller: sellerId,
  });

  if (!product) {
    throw new AppError("Product not found or access denied", 404);
  }

  const allowedFields = [
    "title",
    "description",
    "price",
    "demoUrl",
    "thumbnailUrl",
    "version",
    "tags",
    "techStack",
  ];

  allowedFields.forEach((field) => {
    if (field in updateData) {
      product[field] = updateData[field];
    }
  });

  await product.save();
  return product;
};

const deleteProduct = async (productId, sellerId) => {
  const product = await Product.findOneAndDelete({
    _id: productId,
    seller: sellerId,
  });

  if (!product) {
    throw new AppError("Product not found or access denied", 404);
  }

  return product;
};

module.exports = { createProduct, getAllProducts, getProductById, getSellerProducts, updateProduct, deleteProduct };