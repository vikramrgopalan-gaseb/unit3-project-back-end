const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
    // 1. Get the token from the 'Authorization' header
    // Expected format: "Bearer <token>"
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    // 2. If no token is provided, return 401 (Unauthorized)
    if (!token) {
        return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    try {
        // 3. Verify the token using your secret key
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        
        // 4. Attach the decoded user data (e.g., userId) to the request object
        req.user = verified;
        
        // 5. Move to the next middleware or route handler
        next();
    } catch (error) {
        // 6. If token is invalid or expired, return 403 (Forbidden)
        res.status(403).json({ message: 'Invalid or expired token.' });
    }
};

module.exports = authenticateToken;