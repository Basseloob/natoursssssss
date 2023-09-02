const nodemailer = require('nodemailer'); // Is the website for testing the emails sent.
// Need to read the Nodemailer documentation.
const pug = require('pug');
const { convert } = require('html-to-text');
const mg = require('nodemailer-mailgun-transport');

module.exports = class Email {
  constructor(user, url) {
    this.to = user.email;
    this.firstname = user.name.split(' ')[0];
    this.url = url;
    this.from = `Jonas Schmedtmann <${process.env.EMAIL_FROM}>`;
  }

  newTransport() {
    if (process.env.NODE_ENV === 'development') {
      // Sendgrid :
      return nodemailer.createTransport({
        // service: 'SendGrid', // no need to specify the server and the port - because nodemailer already knows 'sendgrid'
        auth: {
          // from: process.env.SENDGRID_EMAIL_FROM,
          // user: process.env.SENDGRID_USERNAME,
          // pass: process.env.SENDGRID_PASSWORD,
          api_key: 'key-1234123412341234',
          domain:
            'https://app.mailgun.com/app/sending/domains/sandbox7101ed17f87248d5a9fc1e372472caf8.mailgun.org',
          host: 'smtp.mailgun.org',
          port: 587,
          user: 'postmaster@sandbox7101ed17f87248d5a9fc1e372472caf8.mailgun.org',
          pass: 'b8b948d6f105ae537ed76e39b0917df9-451410ff-349c86a8',
        },
        secure: false,
      });
    }

    // if we are in development mode :
    // 1) Create a transporter
    // return nodemailer.createTransport({
    //   host: process.env.EMAIL_HOST,
    //   port: process.env.EMAIL_PORT,
    //   auth: {
    //     user: process.env.EMAIL_USERNAME,
    //     pass: process.env.EMAIL_PASSWORD,
    //   },
    //
    // });
  }

  // Send actual email :
  async send(templateFileName, subject) {
    // 1) Render HTML base on bug templateFileName :
    const html = pug.renderFile(
      `${__dirname}/../views/email/${templateFileName}.pug`, // pug.renderFile -->  it will take a file and render the pug code into real HTML.
      { firstName: this.firstName, url: this.url, subject }
    );

    // 2) Define email options :

    const mailOptions = {
      // from: 'Jonas Schmedtmann <hello@jonas.io>',
      from: this.from,
      // to: options.email,
      to: this.to,
      subject,
      html,
      // text: options.message,
      text: convert(html),
    };

    console.log('mailoptions in mail.js class : ', mailOptions);

    // 3) Create a transport and end email :
    await this.newTransport().sendMail(mailOptions);
  }

  async sendWelcome() {
    // send welcome function is added in authController.js inside signUp functions.
    await this.send(
      'welcome', // welcome.pug file
      'Welcome to the Natours Family! from mail calss'
    );
  }

  async sendPaswordReset() {
    await this.send(
      'passwordReset', // passwordReset.pug
      'your password reset token valid for only 10 minutes'
    );
  }
};

// const sendEmail = async (options) => {
// 1) Create a transporter
// const transporter = nodemailer.createTransport({
//   host: process.env.EMAIL_HOST,
//   port: process.env.EMAIL_PORT,
//   auth: {
//     user: process.env.EMAIL_USERNAME,
//     pass: process.env.EMAIL_PASSWORD,
//   },
// });
// 2) Define the email options
// const mailOptions = {
//   from: 'Jonas Schmedtmann <hello@jonas.io>',
//   to: options.email,
//   subject: options.subject,
//   text: options.message,
//   // html:
// };
// 3) Actually send the email
// await transporter.sendMail(mailOptions);
// };

// module.exports = sendEmail;
