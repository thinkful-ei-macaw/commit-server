const knex = require('knex');
const app = require('../src/app');
const helpers = require('./test-helpers');

describe('Streak Endpoints', function () {
  let db;

  const {
    testUsers,
  } = helpers.makeTaskFixtures();

  before('make knex instance', () => {
    db = knex({
      client: 'pg',
      connection: process.env.TEST_DB_URL,
    });
    app.set('db', db);
  });



  after('disconnect from db', () => db.destroy());

  before('cleanup', () => helpers.cleanTables(db));


  afterEach('cleanup', () => helpers.cleanTables(db));

  describe('GET /api/streak', () => {
    context('Given no user or invalid creds', () => {
      it('responds with 401', () => {
        return supertest(app)
          .get('/api/streak')
          .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
          .expect(401);
      });
    });

    context('Given user exists', () => {

      beforeEach('insert users', () =>
        helpers.seedUsers(
          db,
          testUsers
        ));


      it('responds with 200 and a streak', () => {

        const expectedStreak = {streak: testUsers[0].streak};
 
        return supertest(app)
          .get('/api/streak')
          .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
          .expect(200, expectedStreak);
      });




      describe('PATCH /api/streak', () => {

        it('should update streak', function () {
          const newStreak = {streak: 9};
          

          return supertest(app)
            .patch('/api/streak')
            .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
            .send(newStreak)
            .expect(204);

        });
      });
    });
  });
});