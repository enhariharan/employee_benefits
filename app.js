const createError = require('http-errors');
const express = require('express');
const app = express();
const path = require('path');
const cookieParser = require('cookie-parser');

require('dotenv').config()

const cors = require('cors');
app.use(cors());

// HACK done to log express response JSON also. This should be removed later.
// To remove this hack do these steps:
// 1. Delete _origExpressAppResponseSendFunction
// 2. Delete function _overrideResponseSend()
// 3. Delete variable "format"
// 4. Delete the definition of morgan.token('res-body)
// 5. Replace the variable 'format" with 'combined' in the call to app.use(morgan(format, {stream: logger.stream})); below
const _origExpressAppResponseSendFunction = app.response.send;
app.response.send = function _overrideResponseSend(body) { // NOTE: DO NOT Change this to a lambda function.
  this.ebServerApiResponseBody = body;
  _origExpressAppResponseSendFunction.call(this, body);
}

const morgan = require('morgan');
const logger = require('./config/logger');
const format = ':remote-addr :remote-addr - :remote-user [:date[clf]] :method :url HTTP/:http-version :status :res-body '; //':res :referrer :user-agent'
morgan.token('res-body', (req, res) => JSON.stringify(res.ebServerApiResponseBody),);
app.use(morgan(format, {stream: logger.stream}));

// routers
const usersRouter = require('./routes/users');
const brokingCompaniesRouter = require('./routes/brokingCompanies');
const corporatesRouter = require('./routes/corporates');
const corporateHrsRouter = require('./routes/corporateHrs');
const executivesRouter = require('./routes/executives');
const tpasRouter = require('./routes/tpas');
const insuranceCompaniesRouter = require('./routes/insuranceCompanies');
const customersRouter = require('./routes/customers');
const policiesRouter = require('./routes/policies');
const claimsRouter = require('./routes/claims');
const claimsSoapRouter = require('./routes/claims2');
const nonNetworkHospitalsRouter = require('./routes/nonNetworkHospitals');
const networkHospitalsRouter = require('./routes/networkHospitals');
const notificationsRouter = require('./routes/notifications');
const dashboardRouter = require('./routes/dashboard');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.use(express.static(path.join(__dirname, '/../views/', 'build')));

// app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '/client/build')))
app.use('/static', express.static(path.join(__dirname, '/client/build')));



app.use('/api/v1/users', usersRouter);
app.use('/api/v1/brokingCompanies', brokingCompaniesRouter);
app.use('/api/v1/corporates', corporatesRouter);
app.use('/api/v1/corporateHrs', corporateHrsRouter);
app.use('/api/v1/executives', executivesRouter);
app.use('/api/v1/tpas', tpasRouter);
app.use('/api/v1/insuranceCompanies', insuranceCompaniesRouter);
app.use('/api/v1/customers', customersRouter);
app.use('/api/v1/policies', policiesRouter);
app.use('/api/v1/claims', claimsRouter);
app.use('/api/v1/claims2', claimsSoapRouter);
app.use('/api/v1/nonNetworkHospitals', nonNetworkHospitalsRouter);
app.use('/api/v1/networkHospitals', networkHospitalsRouter);
app.use('/api/v1/notifications', notificationsRouter);
app.use('/api/v1/dashboard', dashboardRouter);

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '/client/build', 'index.html'));
});

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// error handler
app.use((err, req, res, ignoreNext) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
