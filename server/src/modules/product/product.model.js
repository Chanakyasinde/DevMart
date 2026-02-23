const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, 'Product title is required'],
            trim: true,
            maxlength: [100, 'Title cannot exceed 100 characters'],
        },
        description: {
            type: String,
            required: [true, 'Product description is required'],
            maxlength: [2000, 'Description cannot exceed 2000 characters'],
        },
        price: {
            type: Number,
            required: [true, 'Price is required'],
            min: [0, 'Price cannot be negative'],
        },
        category: {
            type: String,
            required: [true, 'Category is required'],
            enum: {
                values: [
                    'Code Templates',
                    'UI Kits',
                    'APIs & Microservices',
                    'AI & ML Starter Kits',
                    'Developer Tools',
                ],
                message: 'Invalid category',
            },
        },
        techStack: {
            type: [String],
            default: [],
        },
        seller: {
            type: mongoose.Schema.ObjectId,
            ref: 'User',
            required: true,
        },
        fileUrl: {
            type: String,
            select: false,
            default: null,
        },
        demoUrl: {
            type: String,
            default: null,
        },
        thumbnailUrl: {
            type: String,
            default: null,
        },
        version: {
            type: String,
            default: '1.0.0',
        },
        licenseType: {
            type: String,
            enum: ['Single Use', 'Multi Use', 'Open Source'],
            default: 'Single Use',
        },
        isApproved: {
            type: Boolean,
            default: false,
        },
        isActive: {
            type: Boolean,
            default: true,
        },
        downloads: {
            type: Number,
            default: 0,
        },
        ratingsAverage: {
            type: Number,
            default: 0,
            min: [0, 'Rating must be above 0'],
            max: [5, 'Rating must be below 5'],
            set: (val) => Math.round(val * 10) / 10,
        },
        ratingsCount: {
            type: Number,
            default: 0,
        },
        tags: {
            type: [String],
            default: [],
        },
    },
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);

productSchema.index({ category: 1 });
productSchema.index({ price: 1 });
productSchema.index({ seller: 1 });
productSchema.index({ title: 'text', description: 'text', tags: 'text' });

module.exports = mongoose.model('Product', productSchema);
