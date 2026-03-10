const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
    
    // Authorization

    const authHeader = req.headers['authorization'];
    let token = 0

    if (authHeader) {
     token = authHeader.split(' ')[1]
    }

    // Filter

    if (!token) {
        return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    try {
        
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        
        
        req.user = verified;
        
        
        next();

    } catch (error) {
        
       return res.status(401).json({ error: error.message });

    }
};

module.exports = authenticateToken;