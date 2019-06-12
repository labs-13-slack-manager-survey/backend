const router = require("express").Router();
const axios = require("axios");
const qs = require("qs");
const Users = require("../models/Users");
const Responses = require("../models/Responses");
const moment = require("moment");

const confirmation = require("../helpers/slackConfirmation");
const authenticate = require("../middleware/authenticate");

const { slackVerification } = require("../middleware/slackMiddleware");

const apiUrl = "https://slack.com/api";

// This is the endpoint that returns the list of channels available for a user
// this endpoint is requested when a user wants to create a new reports, on ComponentDidMount.
router.get("/channels", authenticate, async (req, res, next) => {
  try {
    // We need to construct a url with the users slackToken appended as a query param
    const token = req.decodedJwt.slackToken;
    const endpoint = `${apiUrl}/conversations.list?token=${token}`;
    const { data } = await axios.get(endpoint);
    // If the response is successful and the data object contains a channels array extract the id and name properties and return as json
    if (data.channels) {
      const channels = data.channels.map(channel => ({
        id: channel.id,
        name: channel.name
      }));
      res.status(200).json(channels);
    } else {
      res.status(400).json({ message: "Connecting to Slack was unsuccessful" });
    }
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
    throw new Error(error);
  }
});

router.post("/sendReport", slackVerification, async (req, res) => {
  const payload = JSON.parse(req.body.payload);
  const { type, user } = payload;
  const slackUserId = user.id;
  const { id, fullName } = await Users.findBySlackId(slackUserId);
  // get the id of general channel
  const endpoint = `${apiUrl}/conversations.list?token=${
    process.env.SLACK_ACCESS_TOKEN
  }`;
  const { data } = await axios.get(endpoint);
  const channel = data.channels.find(
    channel => channel.name.toLowerCase() === "general"
  );
  if (type === "block_actions") {
    const value = JSON.parse(payload.actions[0].value);
    //pull questions out of the value and put them in an array
    const questions = JSON.parse(value.questions);
    const managerQuestions = JSON.parse(value.managerQuestions);
    const managerResponses = JSON.parse(value.managerResponses);

    const managerQ =
      managerResponses &&
      managerResponses.map(response => {
        let object = {
          label: response,
          type: "text",
          name: response,
          value: payload.message.text
        };
        return object;
      });
    //map through questions and create an interactive element for each
    const elements = questions.map(question => {
      let object = {
        label: question,
        type: "textarea",
        name: question,
        value: payload.message.text
      };
      return object;
    });
    // const managerQ = value.
    try {
      //call openDialog to send modal in DM

      openDialog(payload, fullName, value, channel.id, elements);
    } catch (error) {
      res
        .status(500)
        .json({ message: "Something went wrong while getting the questions." });
    }
  } else if (type === "dialog_submission") {
    const { submission, state } = payload;
    const reportId = parseInt(/\w+/.exec(state)[0]);
    let [report_Id, channelId, userId] = payload.state.split(" ");
    // const channelId = channel.id;

    //Submissions comes in as { question: answer ... send_by: full_name }. This strips out the questions
    const questions = Object.keys(submission).filter(
      item => item !== "send_by"
    );

    // Revisit, can filter with dynamic user id
    let answers = Object.values(submission);

    answers.splice(answers.length - 1, 1);

    try {
      //immediately respond with an empty 200 response to let slack know command was received
      res.send("");

      report_Id = Number(report_Id);
      console.log(userId);
      const user = await Users.findById(userId);
      console.log("user", user);
      const changesToUser = {
        ...user,
        responsesMade: JSON.stringify([
          ...JSON.parse(user.responsesMade),
          report_Id
        ])
      };

      await Users.update(userId, changesToUser);
      //send confirmation of submission back to user and channel
      confirmation.sendConfirmation(
        user.id,
        answers,
        questions,
        submission,
        channelId
      );

      //create an array of response objects
      const responseArr = answers.map((answer, index) => ({
        reportId,
        userId: id,
        question: questions[index],
        answer: answer,
        submitted_date: moment().format()
      }));

      //insert array of response objects to response table
      await Responses.add(responseArr);
      //not sure we need this
      res.status(200);
    } catch (error) {
      // res.status(500).json({
      //   message: error.message
      // });
      console.log(error.message);
      throw new Error(error);
    }
  }
});

// open the dialog by calling dialogs.open method and sending the payload
const openDialog = async (payload, real_name, value, channel, elements) => {
  // value.id is the id of the report
  const dialogData = {
    token: process.env.SLACK_ACCESS_TOKEN,
    trigger_id: payload.trigger_id,
    dialog: JSON.stringify({
      title: value.reportName,
      callback_id: "report",
      submit_label: "submit",
      state: `${value.id} ${channel} ${value.users[0].id}`,
      elements: [
        ...elements,
        {
          label: "Posted by",
          type: "text",
          name: "send_by",
          value: `${real_name}`
        }
      ]
    })
  };

  // open the dialog by calling dialogs.open method and sending the payload
  const promise = await axios.post(
    `${apiUrl}/dialog.open`,
    qs.stringify(dialogData)
  );
  return promise;
};

module.exports = router;
