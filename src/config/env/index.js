module.exports = {
    node: {
        env: process.env.NODE_ENV,
        port: process.env.NODE_PORT
    },
    database: {
        name: process.env.DB_NAME,
        host: process.env.DB_HOST,
        port: process.env.DB_PORT
    },
    jwt: {
        secret: process.env.JWT_SECRET,
        expiresIn: process.env.JWT_EXPIRE,
        cookieExpiresIn: process.env.JWT_COOKIE_EXPIRE
    },
    mail: {
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        email: process.env.SMTP_EMAIL,
        password: process.env.SMTP_PASSWORD,
        fromEmail: process.env.FROM_EMAIL,
        fromName: process.env.FROM_NAME
    },
    redis: {
        port: process.env.REDIS_PORT,
        host: process.env.REDIS_HOST
    }
};
