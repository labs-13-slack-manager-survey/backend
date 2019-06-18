const router = require("express").Router();
const Responses = require("../models/Responses");
const Reports = require("../models/Reports");
const moment = require("moment");
const Users = require("../models/Users");
const { endOfDay, startOfDay } = require("date-fns");
const { searchReports } = require("../helpers/searchReports");
const {
  filterByUserAndDate,
  filterByDate,
  filterUserLastSevenDays,
  filterSevenDays,
  filterThirtyDays,
  filterTwoWeeks,
  filterOneDay
} = require("../helpers/filters");
router.get("/managerQuestions/:reportId", async (req, res) => {
  try {
    const { reportId } = req.params;
    const { subject } = req.decodedJwt;
    // Find the manager questions associated with the report Id
    const managerFeedback = await Responses.findManagerFeedbackByReportIdAndUserId(
      reportId,
      subject
    );
    res.status(200).json(managerFeedback);
  } catch (err) {
    res.status(500).json({ message: err.message });
    throw new Error(err);
  }
});
router.post("/managerQuestions/:reportId", async (req, res) => {
  try {
    const { reportId } = req.params;
    const { subject, teamId } = req.decodedJwt;
    const { managerQuestions, managerResponses } = req.body;
    // Query the db to verify that this team member is verified to insert a
    // resouce for this report.
    const resource = await Reports.findByIdAndTeamId(reportId, teamId);
    if (resource) {
      const managerFeedback = {
        reportId,
        userId: subject,
        managerQuestions: managerQuestions,
        managerResponses: managerResponses,
        submitted_date: moment().format()
      };
      // add manager feedback to the responses table
      await Responses.add(managerFeedback);
      const managerFeedbackRes = await Responses.findManagerFeedbackByReportIdAndUserId(
        reportId,
        subject
      );
      res.status(201).json(managerFeedbackRes);
    } else {
      res.status(404).json({ message: "report does not exist" });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
    throw new Error(err);
  }
});
// returns the average sentiment of a report
router.get("/sentimentAvg/:reportId", async (req, res) => {
  try {
    const { reportId } = req.params;
    const { teamId, roles } = req.decodedJwt;

    let { average } = await Responses.findAvgSentiment(teamId, reportId);
    // parse the average into a float to 2 decimal places and converts to number from string
    average = Number(Number.parseFloat(average).toFixed(2));
    await Reports.findByIdAndTeamId(reportId, teamId);
    const responses = await filterSevenDays(reportId, roles);

    res.status(200).json([{ average }, ...responses]);
  } catch (err) {
    res.status(500).json({ message: err.message });
    throw new Error(err);
  }
});
// get a user's responses if they've completed a report today
router.get("/", async (req, res) => {
  const { userId } = req.decodedJwt;
  const { reportId } = req.body;
  //use the findToday's db helper, so create startDay and endDay variables in endpoint
  const today = new Date();
  const start = startOfDay(today);
  const end = endOfDay(today);

  try {
    const responses = await Responses.findTodays(userId, reportId, start, end);
    if (responses.length > 1) {
      return res.status(200).json(responses);
    } else {
      return res
        .status(404)
        .json({ message: "The user has not yet filled out any reports" });
    }
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
    throw new Error(error);
  }
});

// This route will insert responses in the database with a reference to the report id
router.post("/:reportId", async (req, res) => {
  const { reportId } = req.params;
  const { subject, teamId } = req.decodedJwt;
  try {
    // Query the db to verify that this team member is verified to insert a
    // resouce for this report.
    const resource = await Reports.findByIdAndTeamId(reportId, teamId);
    console.log(resource);
    // Query db to verify that team member has not already submitted a response today.
    const today = new Date();
    const start = startOfDay(today);
    const end = endOfDay(today);
    const todaysResponses = await Responses.findTodays(
      subject,
      reportId,
      start,
      end
    );

    // If user has already submitted a report throw an error.
    // if (todaysResponses.length > 0) {
    //   throw new Error("You've already submitted your report for today.");
    // }

    // Parse the stringified questions and map to array
    const resourceQuestions = JSON.parse(resource.questions);

    // Compare the questions from the resource variable with the questions from
    // the request body, if the questions don't match, the client has attempted
    // to alter them, throw an error, also check that each response has been
    // filled in.

    for (let i = 0; i < req.body.length; i++) {
      const question = req.body[i].question;
      console.log("test", req.body[0]);
      const response = resource.isSentiment
        ? true
        : req.body[i].response.trim();
      if (response.length < 1) {
        throw new Error("This report requires all responses to be filled in.");
      }

      if (!resourceQuestions.includes(question)) {
        throw new Error("Incoming questions failed verification check");
      }
    }
    // All questions have passed verification and can now be inserted to the model

    const responseArr = req.body.map(body => ({
      reportId,
      userId: subject,
      question: body.question,
      answer: body.response,
      submitted_date: moment().format(),
      sentimentRange: body.sentimentRange,
      sentimentQuestions: body.sentimentQuestions
    }));

    await Responses.add(responseArr);

    const batch = {
      date: today,
      responses: await searchReports(reportId, today)
    };
    // find the user in the database, then update the responsesMade field if found
    const user = await Users.findById(subject);
    const changesToUser = {
      ...user,
      responsesMade: JSON.stringify([
        ...JSON.parse(user.responsesMade),
        Number(reportId)
      ])
    };
    await Users.update(user.id, changesToUser);
    res.status(201).json([batch]);
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
    throw new Error(error);
  }
});

// Gets all responses by report for the last 7 days
router.get("/:reportId", async (req, res) => {
  const { reportId } = req.params;
  const { teamId } = req.decodedJwt;
  try {
    // Run a check in the Reports model to verify that the reportId and TeamId are a match
    // If teamId and reportId don't match with resource error will be thrown
    await Reports.findByIdAndTeamId(reportId, teamId);
    const responses = await filterSevenDays(reportId);
    res.status(200).json(responses);
  } catch (err) {
    res.status(500).json({
      message: err.message
    });
    throw new Error(err);
  }
});

// Gets all responses by report for the last 30 days
router.get("/:reportId/month", async (req, res) => {
  const { reportId } = req.params;
  const { teamId } = req.decodedJwt;
  try {
    // Run a check in the Reports model to verify that the reportId and TeamId are a match
    // If teamId and reportId don't match with resource error will be thrown
    await Reports.findByIdAndTeamId(reportId, teamId);
    const responses = await filterThirtyDays(reportId);
    res.status(200).json(responses);
  } catch (err) {
    res.status(500).json({
      message: err.message
    });
    throw new Error(err);
  }
});

// Gets all responses by report for the last 14 days
router.get("/:reportId/twoWeeks", async (req, res) => {
  const { reportId } = req.params;
  const { teamId } = req.decodedJwt;
  try {
    // Run a check in the Reports model to verify that the reportId and TeamId are a match
    // If teamId and reportId don't match with resource error will be thrown
    await Reports.findByIdAndTeamId(reportId, teamId);
    const responses = await filterTwoWeeks(reportId);
    res.status(200).json(responses);
  } catch (err) {
    res.status(500).json({
      message: err.message
    });
    throw new Error(err);
  }
});

// Gets all responses by report for the day
router.get("/:reportId/day", async (req, res) => {
  const { reportId } = req.params;
  const { teamId } = req.decodedJwt;
  try {
    // Run a check in the Reports model to verify that the reportId and TeamId are a match
    // If teamId and reportId don't match with resource error will be thrown
    await Reports.findByIdAndTeamId(reportId, teamId);
    const responses = await filterOneDay(reportId);
    res.status(200).json(responses);
  } catch (err) {
    res.status(500).json({
      message: err.message
    });
    throw new Error(err);
  }
});

router.post("/:reportId/filter", async (req, res) => {
  const { reportId } = req.params;
  const { teamId } = req.decodedJwt;
  const { user, date } = req.body;
  try {
    // Check user has permission to view this resource
    const report = await Reports.findByIdAndTeamId(reportId, teamId);
    if (report.length < 1) {
      throw new Error("You're not permitted to view this report");
    }

    let responses;
    if (user && date) {
      responses = await filterByUserAndDate(reportId, user, date);
    } else if (date) {
      responses = await filterByDate(reportId, date);
    } else if (user) {
      responses = await filterUserLastSevenDays(reportId, user);
    } else {
      responses = await filterSevenDays(reportId);
    }
    res
      .status(200)
      .json({ clickedDate: date, clickedResponder: user, responses });
  } catch (err) {
    res.status(500).json({
      message: err.message
    });
    throw new Error(err);
  }
});

module.exports = router;
