import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { test, expect } from 'vitest';
import ProductCard from './ProductCard';

test('test for default ProductCard values', () => {
    render(
        <MemoryRouter>
            <ProductCard />
        </MemoryRouter>
    );
    expect(screen.getByText('Untitled Product')).toBeInTheDocument();
    expect(screen.getByText('Free')).toBeInTheDocument();
});

test('test for dynamic product data', () => {
    const dummyProduct = {
        _id: '1',
        title: 'Premium Template',
        price: 999,
        category: 'UI Kits'
    };

    render(
        <MemoryRouter>
            <ProductCard product={dummyProduct} />
        </MemoryRouter>
    );
    expect(screen.getByText('Premium Template')).toBeInTheDocument();
    expect(screen.getByText('₹999')).toBeInTheDocument();
});
