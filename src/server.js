/* eslint-disable no-console */
const app = require('./app');
const knex = require('knex');
const {
  NODE_ENV,
  PORT,
  DATABASE_URL
} = require('./config');

const db = knex({
  client: 'pg',
  connection: DATABASE_URL,
});

app.set('db', db); // everytime someone asks for db, they will get this variable
app.listen(PORT, () => console.log(`Server listening in ${NODE_ENV} mode at http://localhost:${PORT}`));

