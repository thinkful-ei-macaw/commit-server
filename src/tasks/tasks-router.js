const express = require('express');
const TaskService = require('./tasks-service');
const {requireAuth} = require('../middleware/jwt-auth');
const tasksRouter = express.Router();

const serializeTasks = task => ({
  id: task.id,
  name: task.name, 
  complete: task.complete
});

tasksRouter
  .route('/')
  .get((req, res, next) => {
    const knexInstance = req.app.get('db');
 
    TaskService.getAllTasks(knexInstance)
      .then(task => {
        res.json(task.map(serializeTasks));
      })
      .catch(next);
  })
  .post(requireAuth, (req, res, next) => {
    const knexInstance = req.app.get('db');
    const {name} = req.body;
    const newTask = {name, complete: false};
    TaskService.insertTask(
      knexInstance,
      newTask
    )
      .then(task => {
        res.json(task);
      })
      .catch(next);
  });
  
  
tasksRouter
  .route('/:task_id')
  .all((req, res, next) => {
    const knexInstance = req.app.get('db');
    TaskService.getTaskByID(knexInstance, req.params.task_id)
      .then(task => {
        if (!task) {
          return res.status(404).json({
            error: {
              message: 'Task does not exist'
            }
          });
        }
        res.task = task;
        next();
      })
      .catch(next);
  })
  .get((req, res, next) => {
    res.json(serializeTasks(res.task));
  })
  .delete(requireAuth, (req, res, next) => {
    const knexInstance = req.app.get('db');
    TaskService.deleteTask(
      knexInstance,
      req.params.task_id
    )
      .then(() => {
        res.status(204).end();
      })
      .catch(next);
  })
  .patch(requireAuth, (req, res, next) => {
    const knexInstance = req.app.get('db');
    const {name, complete} = req.body; // take values from body
    const newTask = {name, complete}; // storing in variable
    TaskService.updateTask(
      knexInstance,
      newTask
    )
      .then(task => {
        res.json(task);
      })
      .catch(next);
  });

module.exports = tasksRouter;
