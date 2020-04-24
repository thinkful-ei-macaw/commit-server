const express = require('express');
const TaskService = require('./tasks-service');
const {requireAuth} = require('../middleware/jwt-auth');
const tasksRouter = express.Router();
const jsonParser = express.json();
const xss = require('xss');


const serializeTasks = task => ({
  id: task.id,
  name: xss(task.name), 
  complete: task.complete
});
tasksRouter.use(requireAuth);
tasksRouter
  .route('/')
  .get(requireAuth, (req, res, next) => {
    const knexInstance = req.app.get('db');
    TaskService.getAllTasks(knexInstance, req.user.id)
      .then(tasks => {
        res.json(tasks.map(serializeTasks));
      })
      .catch(next);
  })
  .post(jsonParser, (req, res, next) => {
    const {name} = req.body;
    const newTask = {name, complete: false, user_id: req.user.id};
    TaskService.insertTask(
      req.app.get('db'),
      newTask
    )
      .then(task => {
        res
          .status(201)
          .location(`'/tasks/${task.id}`)
          .json(task);
      })
      .catch(next);
  })
  .delete((req, res, next) => {
    const {id} = req.user;
    TaskService.deleteAllTasks(req.app.get('db'), id)
      .then(() => {
        res.status(204).end();
      });
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
        next();
      })
      .catch(next);
  })
  .get((req, res, next) => {
    const knexInstance = req.app.get('db');
    TaskService.getTaskByID(knexInstance, req.params.task_id)
      .then(task => {
        res.json(
          serializeTasks(task)
        );
      })
      .catch(next);
  })
  .delete((req, res, next) => {
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
  .patch(jsonParser, (req, res, next) => {
    const knexInstance = req.app.get('db');
    const {name, complete} = req.body.task; // take values from body
    const newTask = {name, complete}; // storing in variable
    TaskService.updateTask(
      knexInstance,
      newTask,
      req.params.task_id
    )
    
      .then(() => {
       
        res.status(204).end();
      })
      .catch(next);
  });

module.exports = tasksRouter;
