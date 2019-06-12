const Responses = require("../models/Responses");
const dateFns = require("date-fns");

module.exports = {
  searchReports,
  searchReportsByUser
};
// Get reports by reportID for the date specified
async function searchReports(reportId, date, roles) {
  // have to pass date as a Date object
  const startday = dateFns.startOfDay(date);
  const endDay = dateFns.endOfDay(date);
  try {
    // Get responses by report ID for today
    const responses = await Responses.findByAndJoin(reportId, startday, endDay);
    // Create Members Array
    let membersArray = [];

    // Check if responses are in array
    if (responses.length > 0 && roles !== "admin") {
      // Insert First Resource
      membersArray.push({
        userId: responses[0].userId,
        fullName: responses[0].fullName,
        profilePic: responses[0].profilePic,
        questions: [
          {
            id: responses[0].id,
            question: responses[0].question,
            answer: responses[0].answer,
            sentimentRange: responses[0].sentimentRange
          }
        ]
      });

      // Start loop from second resource
      for (let i = 1; i < responses.length; i++) {
        const n = membersArray.length - 1;
        // If the fullName of the current resource matches the fullName of the last resource in the
        // membersArray push the questions to the questions property
        if (membersArray[n].fullName === responses[i].fullName) {
          membersArray[n].questions.push({
            id: responses[i].id,
            question: responses[i].question,
            answer: responses[i].answer,
            sentimentRange: responses[i].sentimentRange
          });
          // If the fullName's do not match insert a new object
        } else {
          membersArray.push({
            userId: responses[i].userId,
            fullName: responses[i].fullName,
            profilePic: responses[i].profilePic,
            questions: [
              {
                id: responses[i].id,
                question: responses[i].question,
                answer: responses[i].answer
              }
            ]
          });
        }
      }
    } else if (responses.length > 0 && roles === "admin") {
      // Insert First Resource
      membersArray.push({
        userId: responses[0].userId,
        fullName: responses[0].fullName,
        profilePic: responses[0].profilePic,
        questions: [
          {
            id: responses[0].id,
            question: responses[0].question,
            answer: responses[0].answer
          }
        ]
      });

      // Start loop from second resource
      for (let i = 1; i < responses.length; i++) {
        const n = membersArray.length - 1;
        // If the fullName of the current resource matches the fullName of the last resource in the
        // membersArray push the questions to the questions property
        if (membersArray[n].fullName === responses[i].fullName) {
          membersArray[n].questions.push({
            id: responses[i].id,
            question: responses[i].question,
            answer: responses[i].answer
          });
          // If the fullName's do not match insert a new object
        } else {
          membersArray.push({
            userId: responses[i].userId,
            fullName: responses[i].fullName,
            profilePic: responses[i].profilePic,
            questions: [
              {
                id: responses[i].id,
                question: responses[i].question,
                answer: responses[i].answer
              }
            ]
          });
        }
      }
    }
    return membersArray;
  } catch (err) {
    //sentry call
    throw new Error(err);
  }
}

async function searchReportsByUser(reportId, userId, date) {
  const startday = dateFns.startOfDay(date);
  const endDay = dateFns.endOfDay(date);
  try {
    const responses = await Responses.findByUserAndJoin(
      reportId,
      userId,
      startday,
      endDay
    );

    // Create Members Array
    let membersArray = [];

    // Check if responses are in array
    if (responses.length > 0) {
      // Insert First Resource
      membersArray.push({
        userId: responses[0].userId,
        fullName: responses[0].fullName,
        profilePic: responses[0].profilePic,
        questions: [
          {
            id: responses[0].id,
            question: responses[0].question,
            answer: responses[0].answer
          }
        ]
      });

      // Start loop from second resource
      for (let i = 1; i < responses.length; i++) {
        const n = membersArray.length - 1;
        // If the fullName of the current resource matches the fullName of the last resource in the
        // membersArray push the questions to the questions property
        if (membersArray[n].fullName === responses[i].fullName) {
          membersArray[n].questions.push({
            id: responses[i].id,
            question: responses[i].question,
            answer: responses[i].answer
          });
          // If the fullName's do not match insert a new object
        } else {
          membersArray.push({
            userId: responses[i].userId,
            fullName: responses[i].fullName,
            profilePic: responses[i].profilePic,
            questions: [
              {
                id: responses[i].id,
                question: responses[i].question,
                answer: responses[i].answer
              }
            ]
          });
        }
      }
    }
    return membersArray;
  } catch (err) {
    //sentry call
    throw new Error(err);
  }
}
