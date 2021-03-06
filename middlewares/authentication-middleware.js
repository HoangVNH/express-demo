const jwt = require('jsonwebtoken');
const rolesService = require('../services/roles-services');

const authenticationMiddleware = async (req, res, next) => {
    const accessToken = req.headers.authorization;
    if (!accessToken) {
        return res.status(401).json('Unauthorized access');
    }

    var decoded = null;
    try {
        decoded = await jwt.verify(accessToken.split(' ')[1], process.env.PRIVATE_KEY);
    } catch (error) {
        return res.status(401).json('Unauthorized access');
    }

    if (!decoded) {
        return res.status(401).json('Unauthorized access');
    }

    req.claims = {
        uid: decoded.uid,
        firstName: decoded.firstName,
        lastName: decoded.lastName,
        email: decoded.email,
        role: await rolesService.getRolesEnumFromRoleIdAsync(decoded.role),
    };
    // TODO: NEED TO REMOVE
    req.body.executedBy = decoded.uid;

    next();
};

module.exports = authenticationMiddleware;