export default () => ({
    port: parseInt(process.env.PORT || '3000', 10),
    redis: {
        url: process.env.REDIS_URL,
    },
    database: {
        url: process.env.DATABASE_URL,
    },
    jwt: {
        secret: process.env.JWT_SECRET,
        expiresIn: process.env.JWT_EXPIRES_IN || '1d',
    },
    url: {
        apiGateway: process.env.API_GATEWAY_PATH || '/api',
        userService: process.env.USER_SERVICE_PATH || '/users',
        notificationService: process.env.PUSH_NOTIFICATION_SERVICE_URL || '/notifications',
        emailService: process.env.EMAIL_SERVICE_URL || '/email',
        templateService: process.env.EMAIL_SERVICE_URL || '/template',
    },
    logLevel: {
        level: process.env.LOG_LEVEL || 'debug',
    }
});
