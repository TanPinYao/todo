TodoApp
========
A simple Todo application built with ASP.NET Core 8, React (MUI), and SQLite, following the Clean Architecture pattern.

TECH STACK
-----------
Backend:  ASP.NET Core 8 Web API
Frontend: React + Material UI (MUI)
Database: SQLite
Architecture: Clean Architecture

FEATURES
---------
- Create, edit, and delete todos
- Organized with Clean Architecture layers
- SQLite auto-seed on first run
- Unit test support using `dotnet test`

PROJECT STRUCTURE
-----------------
TodoApp/
- TodoApp.API/
- todo-frontend/
- TodoApp.Application/
- TodoApp.Domain/
- TodoApp.Infrastructure/
- README.txt

BACKEND SETUP
--------------
1. Navigate to API project:
   cd TodoApp.API

2. Restore and run:
   dotnet restore
   dotnet run

3. Swagger UI:
   https://localhost:{PORT}/swagger

4. A SQLite file (todo.db) is auto-created on first run.

FRONTEND SETUP
---------------
1. Navigate to frontend folder:
   cd todo-frontend

2. Install dependencies:
   npm install

3. Build and start app:
   npm run build
   npm start

4. Open in browser:
   http://localhost:3000

RUNNING UNIT TESTS
-------------------
1. Navigate to test folder (if exists):
   cd TodoApp.Tests

2. Run all tests:
   dotnet test

3. Results will appear in console.

API ENDPOINTS
--------------
[GET TODOS]
- Method:  POST
- Endpoint: /Todo/list
- Request Body: (none)
- Response: {
  "todo_id": number,
  "title": "string",
  "content": "string"
}[]

--------------------------------------

[CREATE TODO]
- Method:  POST
- Endpoint: /Todo
- Request Body:
{
  "title": "string",
  "content": "string"
}
- Response: null

--------------------------------------

[UPDATE TODO]
- Method:  PUT
- Endpoint: /Todo
- Request Body:
{
  "todo_id": number,
  "title": "string",
  "content": "string"
}
- Response: null

--------------------------------------

[DELETE TODO]
- Method:  DELETE
- Endpoint: /Todo/{id}
- Request Body: (none)
- Response: null
