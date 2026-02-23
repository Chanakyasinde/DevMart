const productService = require('./product.service');

exports.createProduct = async (req, res, next) => {
    try {
        const product = await productService.createProduct(req.body, req.user.id);
        res.status(201).json({ status: 'success', data: { product } });
    } catch (error) {
        next(error);
    }
};

exports.getAllProducts = async (req, res, next) => {
    try {
        const result = await productService.getAllProducts(req.query);
        res.status(200).json({ status: 'success', ...result });
    } catch (error) {
        next(error);
    }
};

exports.getProduct = async (req, res, next) => {
    try {
        const product = await productService.getProductById(req.params.id);
        res.status(200).json({ status: 'success', data: { product } });
    } catch (error) {
        next(error);
    }
};

exports.getMyProducts = async (req, res, next) => {
    try {
        const products = await productService.getSellerProducts(req.user.id);
        res.status(200).json({ status: 'success', count: products.length, data: { products } });
    } catch (error) {
        next(error);
    }
};

exports.updateProduct = async (req, res, next) => {
    try {
        const product = await productService.updateProduct(req.params.id, req.user.id, req.body);
        res.status(200).json({ status: 'success', data: { product } });
    } catch (error) {
        next(error);
    }
};

exports.deleteProduct = async (req, res, next) => {
    try {
        await productService.deleteProduct(req.params.id, req.user.id);
        res.status(200).json({ status: 'success', message: 'Product deleted successfully' });
    } catch (error) {
        next(error);
    }
};
