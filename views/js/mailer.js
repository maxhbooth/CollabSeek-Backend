const nodemailer = require('nodemailer');
//const config = require('./config');
nodemailer.createTestAccount((err, account) => {
    // create reusable transporter object using the default SMTP transport
   let transport = nodemailer.createTransport({
        service:'gmail',
        secure: false,
        port : 25,
        auth :{
            user: 'marcussw@cs.unc.edu',
            pass: 'kebab*heels1'
        },
        tls: {
            rejectUnauthorized: false
        }


    });

});
let mailOptions = {
    from: '"Fred Foo 👻" <foo@example.com>', // sender address
    to: 'bar@example.com, baz@example.com', // list of receivers
    subject: 'Hello ✔', // Subject line
    text: 'Hello world?', // plain text body
    html: '<b>Hello world?</b>' // html body
};

// send mail with defined transport object
transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
        return console.log(error);
    }
    console.log('Message sent: %s', info.messageId);
    // Preview only available when sending through an Ethereal account
    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

    // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
    // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
});
