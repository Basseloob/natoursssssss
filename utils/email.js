const nodemailer = require('nodemailer'); // Is the website for testing the emails sent.
// Need to read the Nodemailer documentation.
const pug = require('pug');
const htmlToText = require('html-to-text');

module.exports = class Email {
  constructor(user, url) {
    this.to = user.email;
    this.firstname = user.name.split(' ')[0];
    this.url = url;
    this.from = `Jonas Schmedtmann <${process.env.EMAIL_FROM}>`;
  }

  newTransport() {
    if (process.env.NODE_ENV === 'production') {
      // Sendgrid :
      return 1;
    }

    // if we are in development mode :
    // 1) Create a transporter
    return nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  }

  // Send actual email :
  async send(template, subject) {
    // 1) Render HTML base on bug template :
    const html = pug.renderFile(
      `${__dirname}/../views/email/${template}`, // pug.renderFile -->  it will take a file and render the pug code into real HTML.
      { firstname: this.firstname, url: this.url, subject }
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
      text: htmlToText.fromString(html),
    };

    // 3) Create a transport and end email :
    await this.newTransport().sendMail(mailOptions);
  }

  async sendWelcome() {
    // send welcome function is added in authController.js inside signUp functions.
    await this.send('welcome', 'welcome to the natours family.');
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
