const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

function makeUsersArray() {
  return [{
      id: 4,
      user_name: 'test-user-1',
      password: 'password'
    },
    {
      id: 8,
      user_name: 'test-user-2',
      password: 'password'
    },
    {
      id: 9,
      user_name: 'test-user-3',
      password: 'password'
    },
    {
      id: 10,
      user_name: 'test-user-4',
      password: 'password'
    },
  ]
}

function makeTasksArray() {
  return [{
      user_id: 4,
      id: 1,
      name: 'First test task!',
      complete: false
    },
    {
      user_id: 4,
      id: 2,
      name: 'Second test post!',
      complete: false
    },
    {
      user_id: 10,
      id: 3, 
      name: 'First test task!',
      complete: false
    },
    {
      user_id: 8,
      id: 4,
      name: 'First test task!',
      complete: false
    },
  ]
}

function makeExpectedTask(task) {
  return {
    id: task.id,
    name: task.name,
    complete: task.complete, 
  }
}

function makeTaskFixtures() {
  const testUsers = makeUsersArray()
  const testTasks = makeTasksArray(testUsers)
  return {
    testUsers,
    testTasks,
  }
}

function cleanTables(db) {
  return db.transaction(trx =>
    trx.raw(
      `TRUNCATE
        commit_users,
        commit_tasks
      `
    )
    .then(() =>
      Promise.all([
        trx.raw(`ALTER SEQUENCE commit_users_id_seq minvalue 0 START WITH 1`),
        trx.raw(`ALTER SEQUENCE commit_tasks_id_seq minvalue 0 START WITH 1`),
        trx.raw(`SELECT setval('commit_tasks_id_seq', 0)`),
        trx.raw(`SELECT setval('commit_users_id_seq', 0)`),
      ])
    )
  )
}

function seedUsers(db, users) {
  const preppedUsers = users.map(user => ({...user,
    password: bcrypt.hashSync(user.password, 1)
  }))
  return db.into('commit_users').insert(preppedUsers)
    .then(() =>
      // update the auto sequence to stay in sync
      db.raw(
        `SELECT setval('commit_users_id_seq', ?)`,
        [users[users.length - 1].id],
      )
    )
}

function seedTasksTables(db, users, tasks) {
  return db.transaction(async trx => {
    try {
       await seedUsers(trx, users)
       await trx.into('commit_tasks').insert(tasks)
       await trx.raw(
         `SELECT setval('commit_tasks_id_seq', ?)`,
         [tasks[tasks.length - 1].id],
       )
    }
     catch (error) {
       
     }
    
  })
  
}


function makeAuthHeader(user, secret = process.env.JWT_SECRET) {
  const token = jwt.sign({
    user_id: user.id
  }, secret, {
    subject: user.user_name,
    algorithm: 'HS256',
  })
  return `Bearer ${token}`
}

module.exports = {
  makeUsersArray,
  makeExpectedTask,
  makeTaskFixtures,
  cleanTables,
  seedTasksTables,
  makeAuthHeader,
  seedUsers,
}