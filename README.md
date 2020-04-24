# Commit Server
Back-end framework providing data to the Commit app

## API Documentation 

# GET/[tasks]

Provides an array of all task objects

*Example request/response: 


```HTTP STATUS 200 

https://git.heroku.com/serene-peak-53258.git/tasks

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
  
# POST/[tasks]

Creates a new task. Requires a request body. 

Key | Value
------------ | -------------
name | string
complete | BOOLEAN (false by default)
id | INTEGER
user_id | INTEGER


**Example request/response:**

```
POST https://git.heroku.com/serene-peak-53258.git/tasks

  REQ BODY: { "name": "Task", "complete": "false" }

  HTTP STATUS 201 Created
 ```

--- 
 
# PATCH/[tasks/:id]

Updates task matching id with the fileds provided. Requires a request body with at least one valid field. 

Key | Value
------------ | -------------
id | 1
complete | BOOLEAN, TRUE

**Example request/response:**

```
POST https://git.heroku.com/serene-peak-53258.git/tasks/2

  REQ BODY: { id: "3", complete": "false" }

  HTTP STATUS 200 OK
 ```
 
# DELETE/[tasks/:id]

Deletes item matching id parameter

**Example request/response:**

```
 DELETE https://git.heroku.com/serene-peak-53258.git/tasks/2
    
  HTTP STATUS 200 OK
  {} (empty)
```
