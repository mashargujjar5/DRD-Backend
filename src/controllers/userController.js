// @desc    Get all users
// @route   GET /api/v1/users
// @access  Public
exports.getUsers = async (req, res, next) => {
    try {
        res.status(200).json({ success: true, msg: 'Show all users' });
    } catch (err) {
        res.status(400).json({ success: false });
    }
};
