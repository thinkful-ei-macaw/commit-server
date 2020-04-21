require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const winston = require('winston');
const { NODE_ENV } = require('./config');
const tasksRouter = require('./tasks/tasks-router');
const userRouter = require('./users/users-router');
const authRouter = require('./auth/auth-router');




const app = express();

const morganOption = (NODE_ENV === 'production')
  ? 'tiny'
  : 'common';

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'info.log' })
  ]
});

if (NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple()
  }));
}



// set up middleware
app.use(morgan(morganOption)); // setting up logging
app.use(helmet());
app.use(cors());
app.use('/api/tasks', tasksRouter);
app.use('/api/users', userRouter);
app.use('/api/auth', authRouter);

// request handling
app.get('/', (req, res) => {
  res.send('Hello, world!');
});


// eslint-disable-next-line no-unused-vars
const errorHandler = (error, req, res, next) => {
  let response;
  if (NODE_ENV === 'production') {
    response = { error: { message: 'Server error' } };
  } else {
    response = { message: error.message, error };
  }
console.log(response)
  res.status(500).json(response);
};

app.use(errorHandler);

// the bottom line, literally
module.exports = app;