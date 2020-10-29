import { createTransport } from 'nodemailer';
import config from '../config/env/index.js';
import logger from '../config/logger/index.js';

const sendEmail = async options => {
    const transporter = createTransport({
        host: config.mail.host,
        port: config.mail.port,
        auth: {
            user: config.mail.email,
            pass: config.mail.password
        }
    });
    const message = {
        from: `${config.mail.fromName} <${config.mail.fromEmail}>`,
        to: options.email,
        subject: options.subject,
        text: options.message
    };
    const info = await transporter.sendMail(message);
    logger.info(`Message sent: ${info.messageId}`);
};

export default sendEmail;
