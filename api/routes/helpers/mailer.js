var nodemailer = require('nodemailer');

    // create reusable transporter object using the default SMTP transport
    const transporter = nodemailer.createTransport({
        host: process.env.NODE_EMAIL_SERVICE,
        port: 465,
        secure: true,
        auth: {
            user: process.env.NODE_EMAIL,
            pass: process.env.NODE_PASS
        }
    });

module.exports ={
    sendEmail(from, to , subject, html) {
        return new Promise((resolve, reject) =>{
            transporter.sendMail({ from, to, subject, html} , (err,info) =>
            {
                if(err) reject(err);

                resolve(info);

            });
        });
    }
}