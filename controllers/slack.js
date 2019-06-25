const router = require("express").Router();
const axios = require("axios");

const Users = require("../models/Users");
const Responses = require("../models/Responses");
const moment = require("moment");

const confirmation = require("../helpers/slackConfirmation");
const { openDialog } = require("../helpers/slack");
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
// slack hits this endpoint when anyone intereacts with the button component we created
router.post("/sendReport", slackVerification, async (req, res) => {
  // immediately send a 200 ok status to slack as per requested on the slack documentation
  res.status(200).send();
  const payload = JSON.parse(req.body.payload);
  const { type, user } = payload;
  const slackUserId = user.id;
  const { id, fullName } = await Users.findBySlackId(slackUserId);

  const endpoint = `${apiUrl}/conversations.list?token=${
    process.env.SLACK_ACCESS_TOKEN
  }`;
  const { data } = await axios.get(endpoint);
  // get the id of general channel
  const channel = data.channels.find(
    channel => channel.name.toLowerCase() === "general"
  );
  // if the person clicks on "respond" button to respond to a report, the following if statement runs
  if (type === "block_actions") {
    const value = JSON.parse(payload.actions[0].value);
    //pull questions out of the value
    const questions = JSON.parse(value.questions);
    // pull sentiment questions out of the value
    const sentimentQuestions = JSON.parse(value.sentimentQuestions);
    //map through questions and create an interactive element for each
    const elements = questions.map(question => {
      let object = {
        label: question,
        type: "textarea",
        name: `sent${question}`,
        value: payload.message.text
      };
      return object;
    });
    //map through questions and create an interactive element for each
    const sentimentQuestionElements =
      sentimentQuestions &&
      sentimentQuestions.map(question => {
        let object = {
          label: question,
          name: question,
          type: "select",
          placeholder: "From a scale of 1 - 5",
          options: [
            {
              label: "1",
              value: "1"
            },
            {
              label: "2",
              value: "2"
            },
            {
              label: "3",
              value: "3"
            },
            {
              label: "4",
              value: "4"
            },
            {
              label: "5",
              value: "5"
            }
          ]
        };
        return object;
      });
    // combine both arrays
    const allQuestionsElements = elements.concat(sentimentQuestionElements);
    try {
      //call openDialog to send modal in DM
      openDialog(payload, fullName, value, channel.id, allQuestionsElements);
    } catch (error) {
      res
        .status(500)
        .json({ message: "Something went wrong while getting the questions." });
    }
  } else if (type === "dialog_submission") {
    try {
      //immediately respond with an empty 200 response to let slack know command was received
      const { submission, state } = payload;
      console.log(submission);
      const reportId = parseInt(/\w+/.exec(state)[0]);
      let [report_Id, channelId, userId] = payload.state.split(" ");
      // const channelId = channel.id;

      //  Grab questions out of submission
      const questions = Object.keys(submission).filter(
        item => item !== "send_by"
      );
      // Grab answers out of submission
      let answers = Object.values(submission);
      answers.splice(answers.length - 1, 1);

      report_Id = Number(report_Id);

      const user = await Users.findById(userId);
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
      let responseArr = answers.map((answer, index) => ({
        reportId,
        userId: id,
        question: questions[index],
        answer: Number.isNaN(Number(answer)) ? answer : null,
        submitted_date: moment().format(),
        sentimentRange: Number.isNaN(Number(answer)) ? null : Number(answer)
      }));
      //insert array of response objects to response table
      await Responses.add(responseArr);
      //not sure we need this
      res.status(200);
    } catch (error) {
      // res.status(500).json({
      //   message: error.message
      // });
      throw new Error(error);
    }
  }
});

module.exports = router;
