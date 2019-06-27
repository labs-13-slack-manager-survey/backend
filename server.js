require("dotenv").config();
const express = require("express");
const Sentry = require("@sentry/node");
const cron = require("node-cron");

const { slackReports, sendReports } = require("./helpers/slackReports");

// Url in Interactive Components for production
// https://master-slack-standup.herokuapp.com/api/slack/sendReport

// Url in Interactive Components for development (85bf8bff will change each time you run ngrok)
// https://85bf8bff.ngrok.io/api/slack/sendReport

//run every 30 minutes '0 */30 * * * *'
cron.schedule("0 */1 * * * *", () => {
  console.log("cron job running");
  slackReports();
  sendReports();
});

const middleware = require("./middleware/config");
const authenticate = require("./middleware/authenticate");
const errorMiddleware = require("./middleware/errorReporting");
const authController = require("./controllers/auth");
const userController = require("./controllers/users");
const reportController = require("./controllers/reports");
const responseController = require("./controllers/responses");
const slackController = require("./controllers/slack");
const emailController = require("./controllers/email");

// initializations
const server = express();
// Sentry.init({
// 	dsn: process.env.SENTRY_DSN
// });

// middleware
middleware(server);

// controllers

server.use("/api/auth", authController);
server.use("/api/users", authenticate, userController);
server.use("/api/reports", authenticate, reportController);
server.use("/api/responses", authenticate, responseController);
server.use("/api/email", authenticate, emailController);
// Changes authentication to handle requests from slack
server.use("/api/slack", slackController);

// error reporting middleware (Must be after all requests)
errorMiddleware(server);

//add a message to the Array and it will be added in randomly with the deploy, just another quick way to check if changes have occurred or if the backend has been deployed yet
//this prints out "/" endpoint, feel free to add whatever messages you want
var randomMessage = [
  "Hello World",
  "Welcome Developer",
  "Whose api is this anyway?",
  "Who left the API running?",
  "Welcome to the happiest server on this side of the sea, love.",
  "Reminder: Tip Your Server",
  "Don't Worry 🐝  Happy",
  "Watch Out For  🚩",
  "Testing Is Good",
  "Don't worry it's just a warning.",
  "A Cypress is a tree like structure."
];
//this prints out on the console, feel free to add whatever messages you want
var message = randomMessage[Math.floor(Math.random() * randomMessage.length)];

server.get("/", (req, res) => {
  res.status(200).json({ message });
});
//this prints out the time
let now = new Date().getTime();

if (require.main == module) {
  server.listen(process.env.PORT, () => {
    console.log(
      `*\n
      ${message}\n
      🚀  Server is running at http://localhost:${process.env.PORT}/ \n
      TIME IS: ${now}`
    );
  });
} else {
  module.exports = server;
}
