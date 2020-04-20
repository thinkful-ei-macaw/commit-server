const path = require('path');
const express = require('express');
const xss = require('xss');
const UserService = require('./users-service');
const userRouter = express.Router();
const jsonParser = express.json();

const serializeUser = user => ({
  id: user.id,
  user_name: xss(user.user_name),
  password: xss(user.password),
});

userRouter
  .route('/')
  .get((req, res, next) => {
    const knexInstance = req.app.get('db');
    UserService.getAllUsers(knexInstance)
      .then(users => {
        res.json(users.map(serializeUser));
      })
      .catch(next);
  })
  
  .post(jsonParser, (req, res, next) => {
    const knexInstance = req.app.get('db');
    const {
      username,
      password
    } = req.body;
    const newUser = {
      username,
      password
    };
    for (const [key, value] of Object.entries(newUser))
      if (value == null)
        return res.status(400).json({
          error: {
            message: `${key} not in request body`
          }
        });
    UserService.insertUser(knexInstance, newUser)
      .then(user => {
        res
          .status(201)
          .location(path.posix.join(req.originalUrl + `/${user.id}`))
          .json(serializeUser(user));
      });
    
  });

userRouter
  .route('/:user_id')
  .all((req, res, next) => {
    const knexInstance = req.app.get('db');
    UserService.getById(knexInstance, req.params.user_id)
      .then(user => {
        if (!user) {
          return res.status(404).json({
            error: {
              message: 'User does not exist'
            }
          });
        }
        res.user = user;
        next();
      })
      .catch(next);
  })
  .get((req, res, next) => {
    res.json(serializeUser(res.user));
  })
  .delete((req, res, next) => {
    const knexInstance = req.app.get('db');
    UserService.deleteUser(knexInstance, req.params.user_id)
      .then(() => {
        res.status(204).end();
      })
      .catch(next);
  })
  .patch(jsonParser, (req, res, next) => {
    const knexInstance = req.app.get('db');
    const {
      username,
      password
    } = req.body;

    const updateUser = {
      username,
      password
    };

    const numberOfValues = Object.values(updateUser).filter(Boolean).length;
    if (numberOfValues === 0) {
      return res.status(400).json({
        error: {
          message: 'Request body must contain, \'username, or password\''
        }
      });
    }
    UserService.updateUser(knexInstance, req.params.user_id, updateUser)
      .then(() => {
        res.status(204).end();
      });
  });
module.exports = userRouter;