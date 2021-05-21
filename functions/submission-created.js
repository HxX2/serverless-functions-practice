require("dotenv").config(); // read .env file if present.

const nodemailer = require("nodemailer");
const createHtmlMail = require("./modules/mail-template"); // this function returns html email code

exports.handler = function(event, context, callback) {
  const user = process.env.MAIL_USER;       // some@mail.com
  const pass = process.env.MAIL_PASSWORD;   // 42isthecoolestnumber
  
  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: true,
    auth: { user, pass }
  });
  
  // Parse data sent in form hook (email, name etc)
  const { data } = JSON.parse(event.body);
  
  // make sure we have data and email
  if (!data || !data.email) {
    return callback(null, {
      statusCode: 400,
      body: 'Mailing details not provided'
    })
  }
  
  let mailOptions = {
    from: `"Maciej 🥝 Smoothielicious" <${user}>`,
    to: data.email, // send to email from contact form
    subject: "🍇 Contact submission received! 🍌",
    html: createHtmlMail({ name: data.name }) // returns html code with interpolated variables
  };

  transporter.sendMail(mailOptions, (error, info) => {
    // handle errors
    if (error) {
      return callback(null, {
        statusCode: 500,
        body: JSON.stringify(error)
      });
    }

    // success!
    callback(null, {
      statusCode: 200,
      body: "mail sent"
    });
  });
};
