const express = require('express');
const jsonBodyParser = express.json();
const AuthService = require('./auth-service');
const authRouter = express.Router();

authRouter
  .post('/login', jsonBodyParser, (req, res, next) => {
    const {
      user_name,
      password
    } = req.body;
    const user = {
      user_name,
      password
    };
    for (const [key, value] of Object.entries(user))
      if (value == null)
        return res.status(400).json({
          error: `Missing '${key}' in request body`
        });

    AuthService.getUserWithUserName(
      req.app.get('db'),
      user.user_name
    )
      .then(dbUser => {
        if (!dbUser)
          return res.status(400).json({
            error: 'Incorrect name or 1password'
          });
        return AuthService.comparePasswords(user.password, dbUser.password)
          .then(compareMatch => {
            if (!compareMatch)
              return res.status(400).json({
                error: 'Incorrect name or 2password'
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
      .catch(next);
  });

module.exports = authRouter;