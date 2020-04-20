const express = require('express');
const jsonBodyParser = express.json();
const AuthService = require('./auth-service');
const authRouter = express.Router();
const bcrypt =  require('bcryptjs');

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
    console.log(password)
    for (const [key, value] of Object.entries(user))
      if (value == null)
        return res.status(400).json({
          error: `Missing '${key}' in request body`
        });

    AuthService.getUserWithUserName(
      req.app.get('db'),
      user_name
    )
      .then(dbUser => {
        if (!dbUser)
          return res.status(400).json({
            error: 'Incorrect name or 1password'
          });
         console.log(user_name, dbUser);
         console.log(bcrypt.compareSync('2544252', dbUser.password));
         console.log(dbUser.password)
        return AuthService.comparePasswords(password, dbUser.password)
       
          .then(compareMatch => {
            if (!compareMatch) {
              return res.status(400).json({
                error: 'Incorrect name or 2password'
              });
            }

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