require('dotenv').config();
const knex = require('knex');
const TaskService = require('./tasks/tasks-service')

const knexInstance = knex({
  client: 'pg',
  connection: process.env.DB_URL,
});

console.log(TaskService.getAllTasks());