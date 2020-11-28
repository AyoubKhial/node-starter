const sendMail = ({ options, config, service }) => {
    const transporter = service.createTransport({
        host: config?.mail?.host,
        port: config?.mail?.port,
        auth: {
            user: config?.mail?.email,
            pass: config?.mail?.password
        }
    });
    const message = {
        from: `${config?.mail?.fromName} <${config?.mail?.fromEmail}>`,
        to: options?.email,
        subject: options?.subject,
        text: options?.message
    };
    return transporter.sendMail(message);
};

module.exports = { sendMail };
