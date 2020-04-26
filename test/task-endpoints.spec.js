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
    beforeEach('insert users', () =>
      helpers.seedUsers(db, testUsers)
    )
    it(`responds with 200 and an empty list`, () => {
      return supertest(app)
        .get('/api/tasks')
        .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
        // .send(user)
        .expect(200, [])
    })
  })

  context('Given there are tasks in the database', () => {
    beforeEach('insert tasks', () =>
      helpers.seedTasksTables(
        db,
        testUsers,
        testTasks
      ))

    it('responds with 200 and all of the tasks', () => {

      const expectedTasks = testTasks.filter(task => task.user_id == testUsers[0].id)
        .map(task => helpers.makeExpectedTask(task),

        )

      return supertest(app)
        .get('/api/tasks')
        .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
        .expect(200, expectedTasks)
    })







    describe(`POST /tasks`, () => {
      it(`creates an task, responding with 201 and the new task`, function () {
        this.retries(3)
        const newTask = {
          name: 'Task1',
          complete: false,
        }
        return supertest(app)
          .post('/api/tasks')
          .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
          .send(newTask)
          .expect(201)
          .expect(res => {
            expect(res.body.name).to.eql(newTask.name)
            expect(res.body).to.have.property('id')
            expect(res.body.user_id).to.eql(testUsers[0].id)
            expect(res.body).to.have.property('date_created')


          })
          .then(res =>
            supertest(app)
            .get(`/api/tasks/${res.body.id}`)
            .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
            .expect(res => {
              expect(res.body.name).to.eql(newTask.name)
              expect(res.body).to.have.property('id')
            })
          )
      })
    })

    describe(`DELETE /tasks/:task_id`, () => {
      context(`Given no task`, () => {
        it(`responds with 404`, () => {
          const taskID = 123456
          return supertest(app)
            .delete(`/api/tasks/${taskID}`)
            .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
            .expect(404, {
              error: {
                message: `Task does not exist`
              }
            })
        })
      })

    })


    describe(`GET/tasks/:id`, () => {

      it(`should return a task`, function () {
   
        const id = 1

        return supertest(app)
          .get(`/api/tasks/${id}`)
          .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
          .expect(200)

      })
    })
  





  describe(`PATCH /tasks`, () => {

    it(`should update task to true`, function () {
      const newTask = {
        task: {
          name: 'Jordan',
          complete: true,

        }


      }
      const id = 1

      return supertest(app)
        .patch(`/api/tasks/${id}`)
        .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
        .send(newTask)
        .expect(204)

    })
  })
})
})
})