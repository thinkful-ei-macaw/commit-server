const express = require('express');
const UsersService = require('./users-service');

const usersRouter = express.Router();
const jsonBodyParser = express.json();

usersRouter
  .post('/', jsonBodyParser, (req, res, next) => {
    const {password, user_name} = req.body;
    console.log(password, user_name);

    for(const item of ['user_name', 'password'])
      if(!req.body[item])
        return res.status(400).json({
          error: `Missing ${item} in request body`
        });

    const passwordError = UsersService.validatePassword(password);

    if(passwordError)
      return res.status(400).json({error: passwordError});
    console.log('password is valid');
    UsersService.hasUsername(
      req.app.get('db'),
      user_name
    )
      .then(hasUsername => {
        if (hasUsername) {
          return res.status(400).json({error: 'Username already taken'});
        }
        console.log('username not found');
        return UsersService.hashPassword(password)
          .then(hashedPassword => {
            const newUser = {
              user_name,
              password: hashedPassword
            };
            console.log('this is a new user', newUser);
            return UsersService.insertUser(
              req.app.get('db'),
              newUser
            )
              .then(user => {
                console.log('this is a user', user);
                res
                  .status(201)
                  .json(UsersService.serializeUser(user));
              });
          });
      })
      .catch(next);
  });

module.exports = usersRouter;