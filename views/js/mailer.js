const nodemailer = require('nodemailer');
//const config = require('./config');
nodemailer.createTestAccount((err, account) => {
    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
            user: 'marcussw@cs.unc.edu',
            pass: 'kebab*heels1'
        }
    });
    let mailOptions = {
        from: '"Fred Foo 👻" <marcussw@cs.unc.edu>', // sender address
        to: email, // list of receivers
        subject: 'CollabSeek Verification', // Subject line
        text: 'Hello', // plain text body
        html: html // html body
    };
    // send mail with defined transport object
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log(error);
            return;
        }
        console.log('Message sent: %s', info.messageId);
        // Preview only available when sending through an Ethereal account
        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
    });
});