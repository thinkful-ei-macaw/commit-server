const express = require('express');
const TaskService = require('./tasks-service');

const tasksRouter = express.Router();

tasksRouter
  .route('/')
  .get((req, res, next) => {
    TaskService.getAllTasks(req.app.get('db'))
      .then(task => {
        res.json(task.map(TaskService));
      })
      .catch(next);
  });

  

