const nodemailer = require("nodemailer");

exports.sendMail = ({ reciever, code }) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "abousoudcenter@gmail.com",
      pass: "ooplirnurwzhkjrr",
    },
  });

  const info = {
    from: "abousoudcenter@gmail.com",
    to: reciever,
    subject: "Verification Code",
    html: `<p>Your verification code to reset password is <strong>${code}</strong></p>`,
  };

  transporter.sendMail(info, (err, success) => {
    if (err) {
      console.log(err);
      return;
    }
    console.log(success.response);
  });
};
