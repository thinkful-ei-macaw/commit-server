const path = require('path');
const express = require('express');
const xss = require('xss');
const UserService = require('./users-service');
const userRouter = express.Router();
const jsonParser = express.json();
const {requireAuth } = require('../middleware/jwt-auth');

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
  .get((req, res, next) => {
    const knexInstance = req.app.get('db');

    UserService.getById(knexInstance, req.user.id)
      .then(user => {
        if (!user) {
          return res.status(404).json({
            error: {
              message: 'User does not exist'
            }
          });
        }
        res.user = user;
       res.json(serializeUser(res.user));

        
      })
      .catch(next);
  })
  .delete((req, res, next) => {
    const knexInstance = req.app.get('db');
    UserService.deleteUser(knexInstance, req.user.id)
      .then(() => {
        res.status(204).end();
      })
      .catch(next);
  })
  .patch(jsonParser, requireAuth, (req, res, next) => {
    const knexInstance = req.app.get('db');
    const {
      
      streak
    } = req.body;

    const updateUser = {
      streak,
    };
    
    const numberOfValues = Object.values(updateUser).filter(Boolean).length;
    if (numberOfValues === 0) {

      return res.status(400).json({
        error: {
          message: 'Request body must contain streaks'
        }
      });
    }
    UserService.updateStreaks(knexInstance, updateUser, req.user.id)
      .then(() => {
        res.status(204).send('this streak was updated');
      });
  });
module.exports = userRouter;