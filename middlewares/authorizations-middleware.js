const RolesEnum = require("../constants/roles-enum");

const authorizationsMiddleware = {
    checkRoleAdmin(req, res, next) {
        if (req.claims.role !== RolesEnum.Administrator) {
            return res.status(403).json('Forbidden');
        }

        next();
    },
}

module.exports = authorizationsMiddleware;