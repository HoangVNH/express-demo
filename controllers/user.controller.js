const { userServiceFactory } = require('../services/user.service');

const signIn = async (req, res, next) => {
  const { email, password } = req.body;
  try {
      const uow = await getUnitOfWork(HAS_TRANSACTION.NO);
      const UserService = userServiceFactory(uow);
      const userServices = new UserService();
      const data = await userServices.signIn(email, password);
      await uow.release();
      return res.status(data.statusCode).json(data);
  } catch (error) {
      return next(errorHandler(500, "error", error));
  }
};

module.exports = {
    signIn,
};