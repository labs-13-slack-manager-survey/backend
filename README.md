# **SLACK STANDUP API**

This is the backend for the Lambda Labs 13 project [Slackr](https://slackrs-app.netlify.com/). The product runs aysnchronous standup meetings for teams via a web app or Slack. Managers can create teams, answer managerial standup questions, and customize reports to taylor to their specifications. Those questions are delivered to team members on the schedule determined by the manager. Team members respond in the app or via a Slack DM. Responses are then displayed for the entire team to see.  

# **Deployed Backend**

- https://slackrs-app.herokuapp.com/

# **Technologies**

#### Production

- [Express](https://www.npmjs.com/package/express): `Fast, unopinionated, minimalist web framework for Node.js.`
- [Body parser](https://www.npmjs.com/package/body-parser): `Parse incoming request bodies in a middleware before your handlers.`
- [Bcryptjs](https://www.npmjs.com/package/body-parser): `Allows you to store passwords securely in your database.`
- [Jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken): `Generate and verify json web tokens to maintain a stateless api.`
- [Cron](https://www.npmjs.com/package/cron): `Cron is a tool that allows you to execute something on a schedule`.
- [Knex](https://www.npmjs.com/package/knex): `Knex.js is a "batteries included" SQL query builder for Postgres, MSSQL, MySQL, MariaDB, SQLite3, Oracle, and Amazon Redshift designed to be flexible, portable, and fun to use.`
- [Knex-cleaner](https://www.npmjs.com/package/knex-cleaner): `Helper library to clean a PostgreSQL, MySQL or SQLite3 database tables using Knex.`
- [Pg](https://www.npmjs.com/package/pg): `Non-blocking PostgreSQL client for Node.js.`
- [Sentry](https://www.npmjs.com/package/@sentry/node): `Open-source error tracking that helps developers monitor and fix crashes in real time. Iterate continuously. Boost workflow efficiency. Improve user experience.`
- [Morgan](https://www.npmjs.com/package/morgan): `HTTP request logger middleware for Node.js.`
- [Cors](https://www.npmjs.com/package/cors): `CORS is a Node.js package for providing a Connect/Express middleware that can be used to enable CORS.`
- [Helmet](https://www.npmjs.com/package/helmet): `Helmet helps you secure your Express apps by setting various HTTP headers.`
- [Dotenv](https://www.npmjs.com/package/dotenv): `Dotenv is a zero-dependency module that loads environment variables from a .env file.`
- [SendGrid](https://sendgrid.com/solutions/email-api/): `SendGrid's API proves a customizable integration approach for transactional email.`

#### Development

- [Nodemon](https://www.npmjs.com/package/nodemon): `nodemon is a tool that helps develop Node.js based applications by automatically restarting the node application when file changes in the directory are detected`
- [cross-env](https://www.npmjs.com/package/cross-env): `cross-env helps run scripts that are set and uses environmental variables across multiple platforms`
- [cypress](https://www.npmjs.com/package/cypress): `cypress is a end to end testing framework.`
- [jest](https://www.npmjs.com/package/jest): `Jest is a Javascript Framework that focuses on simplicity. Jest does not have any configuration, and uses snapshots to keep track of large object`

# **Setup**

(# <--- signifies comment)

In your terminal run:

```
# Install dependencies
yarn install

# Starts express server using nodemon
yarn server
```

# **Table of Contents**

- [Third Party Integrations](#third-party-integrations)
- [Authentication And User Management](#authentication-and-user-management)
- [Slack](#slack)
- [SendGrid](#sendgrid)
- [Summary Table of API Endpoints](#summary-table-of-api-endpoints)
- [Database Table Schema](#database-table-schema)
- [Database Models](#database-models)
- [Helpers](#helpers)
- [Middleware](#middleware)
- [Environment Variables](#environment-variables)
- [Maintainers](#maintainers)


# Third Party Integrations

## Authentication and User Management

Authentication is handled via Firebase Auth, which is implemented in the `/controllers/auth.js` using a JSON object provided by [Firebase](https://firebase.google.com/products/auth/) in the management console and customized here with environment variables. A user will sign up or log in via a Firebase component on the front end, which then makes a post call to our Firebase endpoint, delivering an access token in the request body. The endpoint verifies the token using a Firebase `auth` method, then checks the users table. If the user exists, we generate a JWT using a helper found in `/helpers/generateToken.js`, and send it back to the client with a `201` status. If the user does not exist, we insert it into the `Users` table, generate a token, and send the token back with another `201` status. 

## Slack

The [Slack API](https://api.slack.com/start/building) allows for users to recieve reports via DM and respond in kind. That being the case, information needs to be sent from the database `to` an incoming webhook created in the Slack App dashboard. Requests coming `from` Slack are sent to 

## SendGrid

[SendGrid](https://sendgrid.com) allows for Admin users to send email invites to their team members with customized Join Codes. We have installed the SendGrid library, which allows us to collect information on the front end, post it to and endpoint, and call a SendGrid method on it to distribute emails. Note - Outlook users currently do not receive emails sent via Sendgrid. 

# SUMMARY TABLE OF API ENDPOINTS

Aside from `auth/firebase` all requests must be made with a header that includes the JWT returned from the POST request. The header serves several purposes, among them authentication and request specificity (many requests read the user's ID from decoded token). Additionally, requests made to routes protected by the manager validation middleware must include a token from a user whose role is `admin`. Request headers must be formatted as such:

| name            | type   | required | description              |
| --------------- | ------ | -------- | ------------------------ |
| `Content-Type`  | String | Yes      | 'application/JSON'       |
| `Authorization` | String | Yes      | JSON Web Token           |

<br>

#### Authorization Routes

| Method | Endpoint                | Access Control | Description                                  |
| ------ | ----------------------- | -------------- | -------------------------------------------- |
| POST | `/auth/firebase` | all users         | Creates a new entry on Users' table or checks Firebase credentials against an existing entry. Returns a valid token on success.|
| GET | `/auth/slack/` | authenticated users | Accesses a user's Slack account information and updates their record in the Users' table with a current Slack Access token, user ID, and team ID. Returns a JWT reflecting those changes.|

#### Email Routes

| Method | Endpoint                | Access Control | Description                                  |
| ------ | ----------------------- | -------------- | -------------------------------------------- |
| POST    | `/email` | authenticated users      | Takes an object of email addresses, creates a `msg` object, and calls a Sendgrid method on it. |

#### User Routes
| Method | Endpoint                | Access Control | Description                                  |
| ------ | ----------------------- | -------------- | -------------------------------------------- |
| GET    | `/users` | authenticated users      | Returns all users. |
| GET    | `/users/byuser` | authenticated users      | Decodes User ID from Auth token in header and returns that user record.|
| GET    | `/users/team` | authenticated users      | Decodes Team ID from Auth token in header and returns the user records associated with that team ID.|
| GET    | `/joinCode/:joinCode` | authenticated users      | Finds the team ID associated with the join code passed in request parameters and updates the team ID field on the user record associated with the user ID decoded from the Auth token in header. |
| PUT    | `/users` | authenticated users      | Decodes User ID from Auth token in header and updates the User record associated with that ID with the object contained in the request body. |
| PUT    | `/users/:userId` | admin-authenticated users      | Allows for admin users to edit the records of a given user specified by the request parameters by passing a partial or whole user object in the request body. |
| DELETE    | `/users` | authenticated users      | Allows managers to delete users that are no longer in a group channel |

#### Report Routes
| Method | Endpoint                | Access Control | Description                                  |
| ------ | ----------------------- | -------------- | -------------------------------------------- |
| GET    | `/reports` | authenticated users      | Decodes Auth token in header, returns an object of reports associated with teamId of user requesting.|
| GET    | `/reports/:reportID` | authenticated users      | Returns the report specified in req params, as long as it's associated with the teamId in decoded Auth token in req headers.|
| GET    | `/reports/submissionRate/:reportId` | authenticated users      | This route returns the submission rate of a given report |
| GET    | `/reports/submissionRate` | authenticated users      |  Get the historical submission rate of a team by teamId, as long as it's associated with the teamId in decoded Auth token in req headers.|
| POST    | `/reports` | admin-authenticated users      | Decodes Auth token in header, creates an entry in the Reports table, returns an object of reports associated with teamId of user requesting.|
| DELETE    | `/reports/:id` | admin-authenticated users      | Deletes a report specified by reportId in req params|
| PUT    | `/reports/:reportId` | admin-authenticated users      | Takes report ID off req params, updates corresponding Report record with req body. Returns an object full of reports by team ID of user requesting.|


#### Response Routes

| Method | Endpoint                | Access Control | Description                                  |
| ------ | ----------------------- | -------------- | -------------------------------------------- |
| GET    | `/responses` | authenticated users      | Returns a User's responses if they've completed a report today. |
| GET    | `/response/managerQuestions/:reportId` | authenticated users      | get all the manager feedback in a report,as long as it's associated with the teamId in decoded Auth token in req headers.|
| GET    | `/responses/sentimentAvg/:reportId` | authenticated users      |returns the average sentiment of a report, as long as it's associated with the teamId in decoded Auth token in req headers.|
| GET    | `/responses/:reportId` | authenticated users      |Returns all responses by report for the last 7 days|
| GET    | `/responses/:reportId/month` | authenticated users      | Gets all responses by report for the last 30 days, as long as it's associated with the teamId in decoded Auth token in req headers.|
| GET    | `/responses/:reportId/twoWeeks` | authenticated users      | Gets all responses by report for the last 14 days, as long as it's associated with the teamId in decoded Auth token in req headers.|
| GET    | `/responses/:reportId/day` | authenticated users      | Gets all responses by report for the day, as long as it's associated with the teamId in decoded Auth token in req headers.|
| POST    | `/responses/:reportId/filter` | authenticated users      | Returns responses for a given report (in params) on a given date for a given user (passed in request body) |
| POST    | `/responses/:reportId` | authenticated users      | This route will insert responses in the database with a reference to the report id |
| POST    | `/responses/managerQuestions/:reportId` | admin-authenticated users      |  post a new manager feedback to the responses table|
| PUT    | `/responses/managerQuestions/:id` | admin-authenticated users      |  update a manager feedback in the responses table|

#### Slack Routes

| Method | Endpoint                | Access Control | Description                                  |
| ------ | ----------------------- | -------------- | -------------------------------------------- |
| GET    | `/slack/channels` | authenticated users who have integrated slack     | Returns an object with all channels in which that user is currently active . |
| POST    | `/slack/sendReport` | authenticated users who have integrated slack     | Set in Slack API dashboard. Performs various database functions based on the type of request that comes in from Slack. |

<br>
<br>
<br>
<br>

# Database Table Schema

#### USERS

```
{
    id: INTEGER
    teamId: INTEGER
    email: STRING (notNullable, unique)
    password: STRING
    fullName: STRING
    roles: STRING (notNullable)
    profilePic: STRING
    created_at: DATETIME (precision: 2, notNullable)
    timezone: STRING (notNullable)
    joinCode: STRING
    active: BOOLEAN (default to true, notNullable)
    slackToken: TEXT (unique)
    slackUserId: STRING
    slackTeamId: STRING
}
```

#### REPORTS

```
{
    id: INTEGER
    teamID: INTEGER (foreign key in USERS table)
    reportName: STRING (notNullable)   
    created_at: DATETIME (precision: 2, notNullable)
    schedule: TEXT
    scheduleTime: TIME (precision: 2)
    recurring: STRING
    message: TEXT
    responseTimeLimit: DATETIME (precision: 2)
    questions: TEXT
    slackChannelName: STRING
    slackChannelId: STRING
    nextPublishDate: DATETIME (precision: 2)
    active: BOOLEAN (default to true, notNullable)
}
```

#### RESPONSES

```
{
    id: INTEGER
    reportID: INTEGER (unsigned, notNullable, references foreign key in REPORTS table)
    userID: INTEGER (unsigned, notNullable, references foreign key in USERS table)
    question: TEXT (notNullable)
    answer: TEXT 
    submitted_date: DATETIME (precision: 2, notNullable)
}
```
<br>
<br>
<br>
<br>

# Database Models

#### USERS

`add(user)` -> Inserts the provided new User object, returns that object
<br><br>`find()` -> Returns an array of all User objects
<br><br>`findBy(filter)` -> Returns an array of all User objects where `filter`
<br><br>`findByRole(role)` -> Returns an array of all User objects with a given role 
<br><br>`findByJoinCode(joinCode)` -> Returns the team ID for the User record associated with the provided joinCode
<br><br>`findById(userId)` -> Returns the User associated with the provided user ID
<br><br>`findBySlackId(slackId)` -> Returns the User associated with the provided Slack ID
<br><br>`findByTeam(teamId)` -> Returns an array of all Users associated with the provided team ID
<br><br>`findByEmail(email)` -> Returns the User associated with the provided email
<br><br>`update(userId, user)` -> Edits the User record associated with the provided User ID with the information contained in the provided User object
<br><br>`updateTeamId(userId, teamId)` -> Updates the teamId field on the User record associated with the provided User ID with the provided teamId
<br><br>`remove(userId)` -> Removes the User record associated with the provided userId
<br><br>

#### REPORTS

`add(report)` -> Inserts the provided Report object, returns that object
<br><br>
`find()` -> Retuns an array of all Report objects
<br><br>
`findBy(filter)` -> Returns an array of all Report objects where `filter`
<br><br>
`findById(reportId)` -> Returns the Report object associated with the provided report ID
<br><br>
`findByTeam(teamId)` -> Returns an array of Report objects associated with the provided team ID
<br><br>
`findByUserId(userId)` -> Returns an array of all report 
<br><br>
`findByIdAndTeamId(reportId, teamId)` -> Returns the Report record associated with the provided report ID and team ID
<br><br>
`update(id, teamId, report)` -> Updates the Report record associated with the provided report ID and team ID with the new information contained in the provided Report object
<br><br>
`remove(reportId)` -> Deletes the Report record associated with the provided report ID
<br>
<br>
#### RESPONSES

`add(response)` -> Inserts the provided Response object, returns that object
<br><br>
`find()` -> Returns an array of all Response objects
<br><br>
`findBy(filter)` -> Returns an array of all Response objects where `filter`
<br><br>
`findById(responseId)` -> Returns the Response object associated with the provided response ID
<br><br>
`findByAndJoin(reportId, startDay, endDay)` -> Returns an array of objects associated with a provided report ID between two provided dates. Object keys are `userId`, `users.fullName`, `users.profilePic`, `responses.id`, `responses.question`, `responses.answer`, `responses.submitted_date`. They are chronologically ordered from newest to oldest based on `responses.submitted_date`.
<br><br>
`findByUserAndJoin(reportId, userId, startDay, endDay)` -> Returns an array of objects associated with a provided report ID AND a provided user ID between two provided dates. Object keys are `userId`, `users.fullName`, `users.profilePic`, `responses.id`, `responses.question`, `responses.answer`, `responses.submitted_date`. They are chronologically ordered from newest to oldest based on `responses.submitted_date`.
<br><br>
`findTodays(userId, reportId, startDay, endDay)` -> Returns an array of all Response objects associated with the user ID and the report ID between the startDay and the endDay
<br>
<br>
<br>
<br>

# Helpers

`filterReports()` -> Returns an array of reports that are due to be published. Current date and time are defined when the function is invoked, and the function will query all reports in the database, compare each reports `schedule` and `scheduleTime` and return the array of reports that match.
<br><br>
`slackReports()` -> Invokes `filterReports()` which returns an array of reports. On each report iteration the `teamId` is queried in the `Users` table, active users found and the current report are appended to a `stitchedReports` array which is then passed to the `button` function, a helper which provides Slack API functionality.

<br><br>
`generateToken()` -> Returns an encoded token that contains `userId` as subject, roles, teamId, joinCode, slackTeamId, slackUserId and slackToken.
<br><br>

`searchReports(reportId, date)` -> Returns an array of responses, by invoking `Responses findByAndJoin()` model and collating each members response that match `date`.
<br><br>
`searchReportsByUser(reportId, userId, date)` -> Returns an array of responses for one user, by invoking `Responses findByUserAndJoin()` model and collating each members response that match `date`.
<br><br>
`filterByUserAndDate(reportId, userId, date)` -> Returns an array containing a single object with `date` and an array of responses by `userId`
<br><br>
`filterByDate(reportId, date)` ->  Returns an array containing a single object with `date` and an array of responses by all users of a `team`
<br><br>
`filterUserLastSevenDays(reportId, userId)` -> Returns an array containing the last seven days of responses for `one user` for a given `reportId`
<br><br>
`filterSevenDays` -> Returns an array containing the last seven days of responses for `all users` for a given `reportId`
<br>
<br>
<br>
<br>

# Middleware

`authenticate.js` -> Verifies authorization token from the request header, if successful, will add the decoded token to the request as `req.decodedJwt`.

`config.js` -> Returns server configs for Sentry, body-parser, helmet, morgan, cors.

`errorReporting.js` -> Invokes the `errorHandler()` method from Sentry.

`reports.js` -> `adminValidation()` blocks request if user attempts an action that is for admin roles only.

`slackMiddleware` -> blocks request if `x-slack-request-timestamp` is greater than five minutes old or `x-slack-signature` is invalid.


# Environment Variables

In order for the app to function correctly, the user must set up their own environment variables.

For local development, save a .env file in the root directory with the following information. To deploy, be sure to adjust the service's environment variables accordingly (DB Host through Port are specific to local environments, hosting servce will provde you with the appropriate postgreSQL settings):

* DB_HOST = your local host
* DB_DATABASE =y our db name
* DB_USER = your db username
* DB_PASS = your db password
* PORT = your port
* SENTRY_DSN = your sentry dsn key (get from sentry.io website)
* JWT_SECRET = put in whatever secret you want here
* PROJECT_ID = project id from Firebase console
* PRIVATE_KEY_ID = private key id from Firebase console
* PRIVATE_KEY = private key from Firebase console
* CLIENT_EMAIL = client email from Firebase console
* CLIENT_ID = client id from Firebase console
* CLIENT_URL = client url from Firebase console
* SLACK_CLIENT_ID = Client id from Slack API console
* SLACK_CLIENT_SECRET = Client Secret from Slack API console
* SLACK_REDIRECT_URI = Slack redirect URI set to local host auth route for dev and deplyed auth route in deployed
* SLACK_SIGNING_SECRET = in Basic information section on Slack API
* SLACK_ACCESS_TOKEN = bot token from Slack OAuth section
* SENDGRID_API_KEY = API key from Sendgrid console


# Maintainers
|                                      [Ben Tsao](https://github.com/cbtsao47)                                     |                                           [Erica Chen](https://github.com/erica-y-chen)                                             |                                          [Mckay Wrigley](https://github.com/mckaywrigley45)                                              |                                      [Curtis Hubbard](https://github.com/chubbard022)                                         |     [Taylor Blount](https://github.com/thirdeyeclub)    |
| :-----------------------------------------------------------------------------------------------------------------------: | :--------------------------------------------------------------------------------------------------------------------------------------: | :---------------------------------------------------------------------------------------------------------------------------------------: | :----------------------------------------------------------------------------------------------------------------------------: | :---: |
|  [<img src="https://avatars2.githubusercontent.com/u/16598376?s=400&v=4" width = "200" />](github.com/cbtsao47)  |          [<img src="https://avatars0.githubusercontent.com/u/47537927?s=400&v=4" width = "200" />](https://github.com/erica-y-chen)          |              [<img src="https://avatars3.githubusercontent.com/u/29221284?s=400&v=4" width = "200" />](https://github.com/mckaywrigley45)               |  [<img src="https://avatars2.githubusercontent.com/u/16605573?s=460&v=4" width = "200" />](https://github.com/chubbard022)  |[<img src="https://avatars2.githubusercontent.com/u/45549491?s=400&v=4" width="200"/>](https://github.com/thirdeyeclub)
|                  [<img src="https://github.com/favicon.ico" width="15"> ](https://github.com/cbtsao47)                   |                          [<img src="https://github.com/favicon.ico" width="15"> ](https://github.com/erica-y-chen)                           |                        [<img src="https://github.com/favicon.ico" width="15"> ](https://github.com/mckaywrigley45)                        |                   [<img src="https://github.com/favicon.ico" width="15"> ](https://github.com/chubbard022)                   |[<img src="https://github.com/favicon.ico" width="15"> ](https://github.com/thirdeyeclub)
| [ <img src="https://static.licdn.com/sc/h/al2o9zrvru7aqj8e1x2rzsrca" width="15"> ](https://www.linkedin.com/in/cbtsao/) | [ <img src="https://static.licdn.com/sc/h/al2o9zrvru7aqj8e1x2rzsrca" width="15"> ](https://www.linkedin.com/in/eyufanchen/) | [ <img src="https://static.licdn.com/sc/h/al2o9zrvru7aqj8e1x2rzsrca" width="15"> ](https://www.linkedin.com/in/mckay-wrigley-05b496166/) | [ <img src="https://static.licdn.com/sc/h/al2o9zrvru7aqj8e1x2rzsrca" width="15"> ](https://www.linkedin.com/in/curtis-hubbard-945764158/) |




