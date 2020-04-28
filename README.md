# Commit

Back-end framework providing data to the Commit app

### Summary

Commit is a simple solution for building healthier coding habits. Designed for entry-level software engineers. Learning how to code can be exhausting. Earn your streaks by taking breaks after completing coding sessions.

Live at: https://commit.jknox24.now.sh/

Link to Heroku Server: https://serene-peak-53258.herokuapp.com/

### Technologies Used

HTML, CSS, React, NodeJS, Express, PostgreSQL, Jest, and Chai 

### Screenshot 
![screenshot](./repo-image/server-side.png)


### Setting up 

* Install dependencies: npm install
* Create development and test databases: createdb commit, createdb commit-test
* Create database user: createuser jordanknox
* Grant privileges to new user in psql:
* GRANT ALL PRIVILEGES ON DATABASE commit TO jordanknox
* GRANT ALL PRIVILEGES ON DATABASE "commit-test" TO jordanknox
* Prepare environment file: cp example.env .env
* Replace values in .env with:
  * NODE_ENV=development
  * PORT=8080
  * API_TOKEN="your-token-here"
  * DATABASE_URL="postgresql://jordanknox@localhost/commit"
  * JWT_SECRET="jordans-jwt-secret"
  * TEST_DB_URL="postgresql://jordanknox@localhost/commit-test"
* Bootstrap development database: npm run migrate
* Bootstrap test database: npm run migrate:test


### Sample Data

* To seed the user database for development: psql -U jordanknox -d commit -a -f seeds/seed.commit_users.sql
* To seed the tasks database for development: psql -U jordanknox -d commit -a -f seeds/seed.commit_tasks.sql
* To clear user data: psql -U jordanknox -d commit_users -a -f seeds/trunc.commit_users.sql
* To clear user data: psql -U jordanknox -d commit_tasks -a -f seeds/trunc.commit_tasks.sql

### Scripts

* Start application for development: npm run dev
* Run tests: npm test

## API Documentation 

###  POST /api/auth/login

Retrieve a bearer token via the JWT path

HTTP STATUS 200

https://serene-peak-53258.herokuapp.com/api/auth/login


*Example request/response:*
```
{
      "user_name": "Sarah",
      "password": "12345678
}
    
{
     
    "authToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoxLCJpYXQiOjE1ODc2OTcxNTIsImV4cCI6MTU4NzcwNzk1Miwic3ViIjoiSm9yZGFuIn0.rXD8ZL0-8bzjzmwzOViDop0ctsWCdoGdkJVsjwwW4Bw"
    
}
     

``` 

### GET/api/tasks

Provides an array of all task objects

*Example request/response:*


```HTTP STATUS 200 

https://serene-peak-53258.herokuapp.com/api/tasks

 [
    {
      "id": "1",
      "name": "45-minute coding session",
      "complete": "true",
      "date_modified": "2020-04-24T05:15:33.375Z",
      "user_id": 5,
      "streaks": 12
    },
    {
      "id": "10",
      "name": "30-minute coding session",
      "complete": "true",
      "date_modified": "2020-04-24T05:15:33.375Z",
      "user_id": 3,
      "streaks": 19
    }
  ]
  ```
  ---
  
### GET/api/tasks/:id

Returns one task from the database 

*Example request/response:*


```HTTP STATUS 200 

https://serene-peak-53258.herokuapp.com/api/tasks

 [
    {
      "id": "1",
      "name": "45-minute coding session",
      "complete": "true",
      "date_modified": "2020-04-24T05:15:33.375Z",
      "user_id": 5,
      "streaks": 12
    },
    {
      "id": "10",
      "name": "30-minute coding session",
      "complete": "true",
      "date_modified": "2020-04-24T05:15:33.375Z",
      "user_id": 3,
      "streaks": 19
    }
  ]
  ```


### POST /api/tasks

Creates a new task. Requires a request body. 

Key | Value
------------ | -------------
name | string
complete | BOOLEAN (false by default)
id | INTEGER
user_id | INTEGER


**Example request/response:**

```
POST https://serene-peak-53258.herokuapp.com/api/tasks

  REQ BODY: { "name": "Task", "complete": "false" }

  HTTP STATUS 201 Created
 ```

--- 
 
### PATCH /api/tasks/:id

Updates task matching id with the fileds provided. Requires a request body with at least one valid field. 

Key | Value
------------ | -------------
id | 1
complete | BOOLEAN, TRUE

**Example request/response:**

```
POST https://serene-peak-53258.herokuapp.com/api/tasks/2

  REQ BODY: { id: "3", complete": "false" }

  HTTP STATUS 200 OK
 ```
 
### DELETE /api/tasks/:id

Deletes item matching id parameter

**Example request/response:**

```
 DELETE https://git.heroku.com/serene-peak-53258.git/api/tasks/2
    
  HTTP STATUS 200 OK
  {} (empty)
```
### To-do:'s

- [ ]  Finish implementing break notifications   
- [ ] User registration 
- [ ] Streak emoji updates based on streak count