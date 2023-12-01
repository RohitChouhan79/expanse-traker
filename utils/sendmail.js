function sendmailhandler(req, user, res) {
    const otp = Math.floor(1000 + Math.random() * 9000);
    const transport = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        // TODO: replace `user` and `pass` values from <https://forwardemail.net>
        user: "rohitbanna101@gmail.com",
        pass: "luav lryv poxu bcht",
      },
    });
    // receiver mailing info
    const mailOptions = {
      from: "Devloper_pvt.limited<rohitbanna101@gmail.com>",
      to: user.email,
      subject: "Testing Mail Service",
      // text: req.body.message,
      html: `<h1>Your OTP iS ${otp} </h1>`,
    };
  
    transport.sendMail(mailOptions, (err, info) => {
      if (err) return res.send(err);
      // console.log(info);
      user.resetPasswordOtp = otp;
      user.save();
      res.render("otp", { admin: req.user, email: user.email });
      // console.log(info);
  
    });
  }