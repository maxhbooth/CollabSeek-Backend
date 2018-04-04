const nodemailer = require('nodemailer');
const config = require('./config');
const transport = nodemailer.createTransport({
    service:'Mailgun',
    auth: {
        user: config.MAILGUN_USER,
        pass: config.MAILGUN_PASS

    },
    tls:{
        rejectUnauthorized: false

    },

});
module.exports ={
  sendEmail(from,to,subject,html){
        return new Promise((resolve,reject) =>{
            transport.sendMail({from,to,subject,html},(error,info)=>{
                if(error){
                    reject(error);
                }
                resolve(info);
                });
            });
    }
}
