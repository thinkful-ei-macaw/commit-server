const express = require('express');
const AuthService = require('./auth-service');
const {
  requireAuth
} = require('../middleware/jwt-auth');

const authRouter = express.Router();
const jsonBodyParser = express.json();

/** Responsible for logging in a user */

authRouter
  .post('/login', jsonBodyParser, (req, res, next) => {
    const {
      user_name,
      password
    } = req.body;
    const loginUser = {
      user_name,
      password
    };

    /** Send an error message if user_name or password is missing in body*/

    for (const [key, value] of Object.entries(loginUser))
      if (value == null)
        return res.status(400).json({
          error: `Missing '${key}' in request body`
        });


    /** Send error message is user_name or password does not match creds in db */
    AuthService.getUserWithUserName(
      req.app.get('db'),
      loginUser.user_name
    )
      .then(dbUser => {
        if (!dbUser)
          return res.status(400).json({
            error: 'Incorrect user_name or password',
          });

        /** Send error message if string pw does not match db password*/

        return AuthService.comparePasswords(loginUser.password, dbUser.password)
          .then(compareMatch => {
            if (!compareMatch)
              return res.status(400).json({
                error: 'Incorrect user_name or password',
              });

            const sub = dbUser.user_name;
            const payload = {
              user_id: dbUser.id
            };
            res.send({
              authToken: AuthService.createJwt(sub, payload),
            });
          });
      })
      .catch(error => {
        next(error);
      });
  });

authRouter.post('/refresh', requireAuth, (req, res) => {
  const sub = req.user.user_name;
  const payload = {
    user_id: req.user.id
  };
  res.send({
    authToken: AuthService.createJwt(sub, payload),
  });
});

module.exports = authRouter;