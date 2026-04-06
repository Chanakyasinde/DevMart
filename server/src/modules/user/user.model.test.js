const User = require('./user.model');

test('test for user model default values', () => {
    const user = new User({
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123'
    });
    
    expect(user.role).toBe('BUYER');
    expect(user.isVerified).toBe(false);
    expect(user.earnings).toBe(0);
});

test('test user field validation', () => {
    const user = new User({});
    const error = user.validateSync();
    
    expect(error.errors.name).toBeDefined();
    expect(error.errors.email).toBeDefined();
    expect(error.errors.password).toBeDefined();
});
