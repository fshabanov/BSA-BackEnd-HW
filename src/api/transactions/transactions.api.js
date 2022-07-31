const router = require('express').Router();
const { transactionValidation } = require('../../validation');
const { authMiddleware, validatorMiddleware } = require('../../middlewares');
const {
  auth: authService,
  transactions: transactionsService,
} = require('../../services');

const { validateBody } = validatorMiddleware;

router.post(
  '/',
  authMiddleware.isAdmin,
  validateBody(transactionValidation.createTransaction),
  async (req, res, next) => {
    try {
      const [user] = await authService.getUserById(req.body.userId);
      if (!user) {
        return next({ status: 400, message: 'User does not exist' });
      }
      const [result] = await transactionsService.createTransaction(req.body);
      const currentBalance = req.body.amount + user.balance;
      await authService.updateUser(req.body.userId, {
        balance: currentBalance,
      });
      return res.send({
        ...result,
        currentBalance,
      });
    } catch (err) {
      return next({ status: 500 });
    }
  }
);

module.exports = { router };
