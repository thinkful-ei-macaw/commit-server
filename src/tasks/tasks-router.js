const express = require('express');
const TaskService = require('./tasks-service');
const {requireAuth} = require('../middleware/jwt-auth');
const tasksRouter = express.Router();

tasksRouter
  .route('/')
  .get((req, res, next) => {
    TaskService.getAllTasks(req.app.get('db'))
      .then(task => {
        res.json(task.map(TaskService));
      })
      .catch(next);
  })
  .post(requireAuth, (req, res, next) => {
    const {name} = req.body;
    const newTask = {name, complete: false};
    TaskService.insertTask(
      req.app.get('db'),
      newTask
    )
      .then(task => {
        res.json(task);
      })
      .catch(next);
  });
  
  
tasksRouter
  .route('/:id')
  .delete(requireAuth, (req, res, next) => {
    TaskService.deleteTask(
      req.app.get('db'),
      req.params.id
    )
      .then(() => {
        res.status(204).end();
      })
      .catch(next);
  })
  .patch(requireAuth, (req, res, next) => {
    const {name, complete} = req.body; // take values from body
    const newTask = {name, complete}; // storing in variable
    TaskService.updateTask(
      req.app.get('db'),
      newTask
    )
      .then(task => {
        res.json(task);
      })
      .catch(next);
  })
  .get(requireAuth, (req, res, next) => {
    TaskService.getTaskByID(
      req.app.get('db'), req.params.id)
      .then(task => {
        if(!task) {
          return res.sendStatus(404);
        }
        res.json(task);
      })

      .catch(next);
  });

module.exports = tasksRouter;
