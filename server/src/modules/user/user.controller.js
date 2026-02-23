const userService = require('./user.service');

const sendTokenResponse = (user, statusCode, res) => {
    const token = user.getSignedJwtToken();
    const options = {
        expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
    };

    user.password = undefined;

    res.status(statusCode).cookie('token', token, options).json({
        status: 'success',
        token,
        data: { user },
    });
};

exports.register = async (req, res, next) => {
    try {
        const { name, email, password, role } = req.body;
        const user = await userService.registerUser({ name, email, password, role });
        sendTokenResponse(user, 201, res);
    } catch (error) {
        next(error);
    }
};

exports.login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const user = await userService.loginUser({ email, password });
        sendTokenResponse(user, 200, res);
    } catch (error) {
        next(error);
    }
};

exports.logout = (req, res) => {
    res.cookie('token', 'none', { expires: new Date(Date.now() + 10 * 1000), httpOnly: true });
    res.status(200).json({ status: 'success', message: 'Logged out successfully' });
};

exports.getMe = async (req, res, next) => {
    try {
        const user = await userService.getUserProfile(req.user.id);
        res.status(200).json({ status: 'success', data: { user } });
    } catch (error) {
        next(error);
    }
};

exports.updateMe = async (req, res, next) => {
    try {
        const user = await userService.updateUserProfile(req.user.id, req.body);
        res.status(200).json({ status: 'success', data: { user } });
    } catch (error) {
        next(error);
    }
};
