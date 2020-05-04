const express = require('express');
const {
  requireAuth
} = require('../middleware/jwt-auth');
const streakRouter = express.Router();
const jsonParser = express.json();
const StreakService = require('./streak-service');




/** Require all endpoints to require a authorized user */

streakRouter.use(requireAuth);

/** Endpoint for getting all tasks */
streakRouter
  .route('/')
  .get((req, res, next) => {
    const knexInstance = req.app.get('db');
    StreakService.getStreak(knexInstance, req.user.id)
      .then(streak => {
        res.json(streak);
      })
      .catch(next);
  })
  .patch(jsonParser, (req, res, next) => {
    const knexInstance = req.app.get('db');
    const {streak} = req.body;

    if (!streak) {
      return res.status(400).json({
        error: {
          message: 'Request body must contain streaks'
        }
      });
    }
    StreakService.updateStreaks(knexInstance, streak, req.user.id)
      .then(() => {
        res.status(204).end();
      })
      .catch(next);
  });

  

module.exports = streakRouter;
