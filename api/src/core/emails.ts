import * as _config from '../config/config';
import nodemailer from 'nodemailer';

const config = _config.config;

const transporter = nodemailer.createTransport({
    host: config.smtp.host,
    port: config.smtp.port,
    secure: config.smtp.secure,
    auth: {
        user: config.smtp.auth.user,
        pass: config.smtp.auth.pass
    }
});

export const sendEmail = async (to: string, subject: string, text: string) => {
    const mailOptions = {
        from: config.smtp.auth.user,
        to,
        subject,
        text
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('Email sent');
    } catch (err) {
        console.error(err);
    }
};
