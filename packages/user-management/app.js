const express = require('express');
const helmet = require('helmet');
const xss = require('xss-clean');
const mongoSanitize = require('express-mongo-sanitize');
const compression = require('compression');
const cors = require('cors');
const passport = require('passport');

const httpStatus = require('http-status');
const { errorConverter, errorHandler } = require('utility/middlewares/error');

const config = require('utility/config/config');
const morgan = require('utility/config/morgan');
const ApiError = require('utility/utils/ApiError');
const path = require('path');
const routes = require('./routes/v1');
const { jwtStrategy } = require('./config/passport');

const app = express();

app.use('/upload', express.static(path.join('upload')));

if (config.env !== 'test') {
  app.use(morgan.successHandler);
  app.use(morgan.errorHandler);
}

app.set('trust proxy', 2);

// set security HTTP headers
app.use(helmet());

// parse json request body
app.use(express.json());

// parse urlencoded request body
app.use(express.urlencoded({ extended: true }));

// sanitize request data
app.use(xss());
app.use(mongoSanitize());

// gzip compression
app.use(compression());

// enable cors
app.use(cors());
app.options('*', cors());

app.use(
  '/user/v1/users/validateworkemail',
  cors({ origin: '*', optionsSuccessStatus: 200, methods: ['POST', 'GET', 'OPTION'] })
);

// jwt authentication
app.use(passport.initialize());
passport.use('jwt', jwtStrategy);

// limit repeated failed requests to auth endpoints
// app.use('/user/v1/auth/login', authLimiter);

// v1 api routes
app.use('/user/v1', routes);

// send back a 404 error for any unknown api request
app.use((req, res, next) => {
  next(new ApiError(httpStatus.NOT_FOUND, 'Not found'));
});

// convert error to ApiError, if needed
app.use(errorConverter);

// handle error
app.use(errorHandler);

module.exports = app;
