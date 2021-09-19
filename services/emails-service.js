const sgMail = require('@sendgrid/mail');

const emailsService = {
    async sendUserRegistrationEmailAsync(firstName, lastName, userEmail, otp) {
        const result = await sendAsync(
            userEmail,
            `Welcome new bidder ${firstName} ${lastName} aboard!`,
            `Please verify your account to complete the registration.<br />
Your OTP is: <b>${otp}</b>.<br />
Note: The OTP is valid only in 5 minutes.`);

        return result;
    },
};

async function sendAsync(to, subject, content) {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);

    const msg = {
        to,
        from: process.env.SENDGRID_SINGLE_SENDER,
        subject: subject,
        text: ' ',
        html: content,
    };

    var result = await sgMail.send(msg);

    return result;
};

module.exports = emailsService;