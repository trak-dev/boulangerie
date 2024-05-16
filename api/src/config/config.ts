import env from 'dotenv';
env.config();

export const config = {
    smtp : {
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
            user: process.env.SMTP_USER || '',
            pass: process.env.SMTP_PASSWORD || ''
        }
    },
    jwt: {
        secret : process.env.JWT_SECRET || 'secret',
        expiresIn: '1h'
    },
    mongoUrl: process.env.MONGOURL || 'mongodb://127.0.0.1:27017/yummy-yams',
    port : process.env.PORT || 8080,
    frontUrl: process.env.FRONTEND_URL || "http://localhost:4200"
};