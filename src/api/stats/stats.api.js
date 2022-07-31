const router = require('express').Router();
const { authMiddleware } = require('../../middlewares');
const data = require('../../data');

router.get('/', authMiddleware.isAdmin, (_req, res, next) => {
  try {
    res.send(data.statsData.stats);
  } catch (err) {
    return next({ status: 500 });
  }
});

module.exports = { router };
