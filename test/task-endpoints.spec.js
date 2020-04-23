const knex = require('knex')
const app = require('../src/app')
const helpers = require('./test-helpers')

describe('Tasks Endpoints', function () {
  let db

  const {
    testUsers,
    testTasks,
  } = helpers.makeTaskFixtures()

  before('make knex instance', () => {
    db = knex({
      client: 'pg',
      connection: process.env.TEST_DB_URL,
    })
    app.set('db', db)
  })

  after('disconnect from db', () => db.destroy())

  before('cleanup', () => helpers.cleanTables(db))

  afterEach('cleanup', () => helpers.cleanTables(db))

  describe(`GET /api/tasks`, () => {
    context(`Given no tasks`, () => {
      beforeEach('insert users', () => {
         helpers.seedUsers(db, testUsers)
      })
      it(`responds with 200 and an empty list`, () => {
        return supertest(app)
          .get('/api/tasks')
          .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
          .expect(200, [])
      })
    })

    context('Given there are tasks in the database', () => {
      beforeEach('insert tasks', () =>
        helpers.seedTasksTables(
          db,
          testUsers,
          testTasks,
        )
      )

      it.only('responds with 200 and all of the tasks', () => {
     
        const expectedTasks = testTasks.map(task =>

          helpers.makeExpectedTask(task),
    
        )
        console.log(expectedTasks)
        return supertest(app)
          .get('/api/tasks')
          .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
          .expect(200, expectedTasks)
      })
    })

    



  })
})