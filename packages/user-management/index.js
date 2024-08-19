const mongoose = require('mongoose');
const config = require('utility/config/config');
const logger = require('utility/config/logger');
const app = require('./app');
const resourceCron = require('./cron/resource');
const { bondCron } = require('./cron/mail.cron');

let server;

mongoose.connect(config.mongoose.url, config.mongoose.options).then(() => {
  logger.info('User Connected to MongoDB');
  server = app.listen(config.user_port, async () => {
    logger.info(`Listening to port ${config.user_port}`);
  });
  bondCron();
  resourceCron();
});

const exitHandler = () => {
  if (server) {
    server.close(() => {
      logger.info('User Server closed');
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
};

const unexpectedErrorHandler = (error) => {
  logger.error(error);
  exitHandler();
};

process.on('uncaughtException', unexpectedErrorHandler);
process.on('unhandledRejection', unexpectedErrorHandler);

process.on('SIGTERM', () => {
  logger.info('SIGTERM received');
  if (server) {
    server.close();
  }
});
