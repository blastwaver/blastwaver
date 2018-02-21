const express = require('express');
const router = express.Router();
const smtpPool = require('nodemailer-smtp-pool');
const config = require('../../config.json');
const nodemailer = require('nodemailer');



const transporter = nodemailer.createTransport(smtpPool({
    service: config.mailer.service,
    host: config.mailer.host,
    port: config.mailer.port,
    auth: {
      user: config.mailer.user,
      pass: config.mailer.password
    },
    tls: {
      rejectUnauthorize: false
    },
    maxConnections: 5,
    maxMessages: 10
  }));

router.post("/email", (req, res, next) => {
    let mailOptions = {
        from: req.body.from,
        to: 'blastwaver@naver.com',
        subject: req.body.subject,
        html: `<h2>${req.body.name}</h2><p>${req.body.comment}</p>`
    };
      
    transporter.sendMail(mailOptions, function(error, info){
    if (error) {
        res.status(500).send('Email fail: ' + error);
    } else {
        res.status(200).send('Email sent: ' + info.response);
    }
    });
});


module.exports = router;