const Responses = require('../models/Responses');
const dateFns = require('date-fns');

module.exports = {
  searchReports,
  searchReportsByUser
}

async function searchReports(reportId, date) {
  const startday = dateFns.startOfDay(date);
  const endDay = dateFns.endOfDay(date)
  try {
    const responses = await Responses.findByAndJoin(reportId, startday, endDay);

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
    console.log(err);
    //sentry call
    throw new Error(err);
  }
}

async function searchReportsByUser(reportId, userId, date) {
  const startday = dateFns.startOfDay(date);
  const endDay = dateFns.endOfDay(date)
  try {
    const responses = await Responses.findByUserAndJoin(reportId, userId, startday, endDay);

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
    console.log(err);
    //sentry call
    throw new Error(err);
  }
}