const { User } = require('../Infrastructure/dist/Repository');
const { generateToken } = require('../Helper/jwt.helper');

const { JWT_SECRET } = process.env;

const userServiceFactory = uow => class UserService {
    async signIn(email, password) {
        const userRepo = uow.getCustomRepository(User);
        const result = await userRepo.signIn(email, password);
        if (result.status) {
            const { user: { id, email: userEmail, role } } = result;
            const payload = {
                id,
                email: userEmail,
                role,
            };
            const accessToken = await generateToken(payload, process.env.JWT_SECRET, "24h");
            const refreshToken = await generateToken(payload, process.env.JWT_SECRET, "7d");
            return {
                statusCode: 200,
                status: "success",
                message: result.message,
                accessToken,
                refreshToken,
            };
        }
        return {
            statusCode: 400,
            status: "error",
            message: result.message,
        };
    }
};

module.exports = {
    userServiceFactory,
};
