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

/** Require all endpoints to require a authorized user */

tasksRouter.use(requireAuth);

/** Endpoint for getting all tasks */
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

/** Endpoint for creating a task */

  .post(jsonParser, (req, res, next) => {
    const {name} = req.body; // Capturing the task name from the request body 
    const newTask = {name, complete: false, user_id: req.user.id}; // Passing task values into an object
    TaskService.insertTask( // Callign method that inserts a new task into the database 
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
  }),
  
tasksRouter
  .route('/:task_id') // Endpoint responsible for getting a task by its ID
  .all((req, res, next) => {
    const knexInstance = req.app.get('db'); 
    TaskService.getTaskByID(knexInstance, req.params.task_id) // Capture task_id from URL parameter. 
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
    const newTask = {name, complete}; // storing values in variable
    
    TaskService.updateTask( // pass newTask object and id to updateTask method when a task is marked complete
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
