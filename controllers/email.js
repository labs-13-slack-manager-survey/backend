const router = require("express").Router();
const sgMail = require("@sendgrid/mail");

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

router.post("/", async (req, res) => {
  try {
    const { email, joinCode } = req.body;
    const msg = {
      to: email,
      from: "lambdalabs13@gmail.com",
      subject: "Welcome to Slackr",
      text: `Join our Slackr team! Go to https://slackrs-app.netlify.com/login, create a login, and enter your join code (${joinCode}) when prompted.`
    };
    console.log(email);
    const success = await sgMail.send(msg);
    res.status(200).end();
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Sorry but something went wrong while sending the emails."
    });
    throw new Error(error);
  }
});

module.exports = router;
