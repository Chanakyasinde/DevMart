import { render, screen } from '@testing-library/react';
import App from './App';
import { describe, it, expect, vi } from 'vitest';

describe('App', () => {
    it('renders DevMart title', () => {
        // Mock fetch
        global.fetch = vi.fn(() =>
            Promise.resolve({
                json: () => Promise.resolve({ status: 'ok', message: 'Test Msg', timestamp: 'now' })
            })
        );

        render(<App />);
        const linkElements = screen.getAllByText(/DevMart/i);
        expect(linkElements.length).toBeGreaterThan(0);
    });
});
