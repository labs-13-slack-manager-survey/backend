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
    await sgMail.send(msg);
    res.status(200).end();
  } catch (error) {
    res.status(500).json({
      message: "Sorry but something went wrong while sending the emails."
    });
    throw new Error(error);
  }
});
router.post("/sendFeedBack", async (req, res) => {
  try {
    const { mail } = req.body;
    const msg = {
      to: "lambdalabs13@gmail.com",
      from: "lambdalabs13@gmail.com",
      subject: "User Feedback",
      text: `name:${mail.name} \nemail:${mail.email} \nlikes:${
        mail.likes
      } \ndislikes:${mail.dislikes}`
    };
    await sgMail.send(msg);
    res.status(200).end();
  } catch (error) {
    res.status(500).json({
      message: "Sorry but something went wrong while sending the emails."
    });
    throw new Error(error);
  }
});

module.exports = router;
