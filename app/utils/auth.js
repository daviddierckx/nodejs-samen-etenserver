const jwt = require('jsonwebtoken');

exports.authenticateToken = function (req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) {
        return res.status(401).send({ "success": false, "error": "Unauthorized" });
    }

    jwt.verify(token, '82429be661aae2a25903ca165d609760716eaf0b612ceed76e87373829cd91fd5760c6f6bcc1b19d1cb94721d67dcf22c3698d89a369cd4084ec09b5dc57bc40', (err, user) => {
        if (err) {
            return res.status(403).send({ "success": false, "error": "Forbidden" });
        }
        req.user = { userId: user.userId }; // Assuming the user ID is stored in the user object
        next();
    });
};
