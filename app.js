// Start the express app :
const path = require('path');
const express = require('express');
const app = express();
const fs = require('fs');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitiz = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const cookieParser = require('cookie-parser');

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');

const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const reviewRouter = require('./routes/reviewsRoute');
const viewRouter = require('./routes/viewRoutes');

// Template Engine :
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views')); // joinnin the directory name to the views behind the scenes :

///////////////////////////////////////////////////////////////////////////////////////////
// 1) Global Middle Ware :

// Serving static files :
app.use(express.static(path.join(`${__dirname}/public`)));

// Set security HTTP headers :
app.use(helmet()); // Better been at the first middleware : read helmet documentation --> https://www.udemy.com/course/nodejs-express-mongodb-bootcamp/learn/lecture/15065346#content

app.use(morgan('dev')); // GET /api/v1/tours 200 4.369 ms - 8751

// Development logging :
if (process.env.NODE_ENV === 'development') {
  console.log('we are in the DEVELOPMENT env');
}
//  else {
//   console.log('we are in the PRODUCTION env');
// }

// Limit requests from the same API :
const limiter = rateLimit({
  //100 req from the same IP in 1 hour.
  max: 100,
  windowMs: 60 * 60 * 100,
  message: 'Too many request from this IP, please try again in an hour!',
});
app.use('/api', limiter);

// Body parser - reading data from the body into req.body
app.use(express.json({ limit: '10kb' })); // 10kb --> is the amount of data that comes in the body... more than 10KB would not work.
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser());

// Data sanitization againt NoSQL query injection :     "email":{"$gt":""},
app.use(mongoSanitiz()); // it will filter out the $ sgins.

// Data sanitization againt XSS query injection :
app.use(xss()); // prevent injection of malicious HTML code.

// Prevent paramater polution --> Review lesson 146 for more info :
app.use(
  hpp({
    whitelist: [
      'duration',
      'ratingsQuantity',
      'ratingsAverage',
      'maxGroupSize',
      'difficulty',
      'price',
    ],
  })
);

// Serving static files :
// app.use(express.static(`${__dirname}/public`)); // serving static files --> http://localhost:3000/overview.html

// app.use((req, res, next) => {
//   console.log('Hello from the Global MiddleWare...');
//   next();
// });

// Test middleware :
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  console.log('Time of request MiddleWare in app.js', req.requestTime);
  console.log('The Cookie for the specified request in app.js: ', req.cookies);
  // console.log('req.headers = ', req.headers); // access to http headers with express :
  next();
});

///////////////////////////////////////////////////////////////////////////////////////////
// 2) Route Handlers:

///////////////////////////////////////////////////////////////////////////////////////////
// 3) Routes :

// app.get('/api/v1/tours', getAllTours);
// app.get('/api/v1/tours/:id', getTour);
// app.post('/api/v1/tours', createTour);
// app.patch('/api/v1/tours/:id', updateTour);
// app.delete('/api/v1/tours/:id', deleteTour);
// app.route('/api/v1/tours').get(getAllTours).post(createTour);
// app
//   .route('/api/v1/tours/:id')
//   .get(getTour)
//   .patch(updateTour)
//   .delete(deleteTour);

// app.get('/', (req, res) => {
//   res.status(200).render('base.pug', {
//     tour: 'The Forest Hiker',
//     user: 'Basil Baragaba',
//   });
// });

// app.get('/overview', (req, res) => {
//   res.status(200).render('overview.pug', {
//     title: 'All Tours',
//   });
// });

// app.get('/tour', (req, res) => {
//   res.status(200).render('tour.pug', {
//     title: 'The Forest Hiker Tour',
//   });
// });

app.use('/', viewRouter);
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);

// Error route handler :

app.all('*', (req, res, next) => {
  // // all for get,post,delete..
  // res.status(404).json({
  //   status: 'fail',
  //   message: `Cant find ${req.originalUrl} on this server`,
  // });

  // // Creating an error :
  // const err = new Error(`Cant find ${req.originalUrl} on this server!`);
  // err.status = 'fail';
  // err.statusCode = 404;

  // next(err); // Passing the err inside the next --> will skip all the middleware and move directly to the error.

  next(
    new AppError(`Heeeeey Cant find ${req.originalUrl} on this server!`, 404)
  );
});

// Global Error route handler :

// app.use((err, req, res, next) => {
//   // 4 argumnet means it an error handler.

//   console.error(err.stack); // shows where the error occurred.
//   err.statusCode = err.statusCode || 500;
//   err.status = err.status || 'error';

//   res.status(err.statusCode).json({
//     status: err.status,
//     message: err.message,
//   });
// });

app.use(globalErrorHandler);

///////////////////////////////////////////////////////////////////////////////////////////
//Server.js

module.exports = app;

///////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////

// const express = require('express'),
//   app = express();
// const fs = require('fs');
// const morgan = require('morgan');

// const tourRouter = require('./routes/tourRoutes');
// const userRouter = require('./routes/userRoutes');

// ///////////////////////////////////////////////////////////////////////////////////////////
// // 1) Middle Ware :

// app.use(morgan('dev')); // GET /api/v1/tours 200 4.369 ms - 8751

// if (process.env.NODE_ENV === 'development') {
//   console.log('we are in the DEVELOPMENT env');
// } else {
//   console.log('we are in the PRODUCTION env');
// }

// app.use(express.json());
// app.use(express.static(`${__dirname}/public`)); // serving static files --> http://localhost:3000/overview.html

// // app.use((req, res, next) => {
// //   console.log('Hello from the Global MiddleWare...');
// //   next();
// // });
// app.use((req, res, next) => {
//   req.requestTime = new Date().toISOString();
//   console.log('Time of request MiddleWare ', req.requestTime);
//   next();
// });

// ///////////////////////////////////////////////////////////////////////////////////////////
// // 2) Route Handlers:

// ///////////////////////////////////////////////////////////////////////////////////////////
// // 3) Routes :

// // app.get('/api/v1/tours', getAllTours);
// // app.get('/api/v1/tours/:id', getTour);
// // app.post('/api/v1/tours', createTour);
// // app.patch('/api/v1/tours/:id', updateTour);
// // app.delete('/api/v1/tours/:id', deleteTour);
// // app.route('/api/v1/tours').get(getAllTours).post(createTour);
// // app
// //   .route('/api/v1/tours/:id')
// //   .get(getTour)
// //   .patch(updateTour)
// //   .delete(deleteTour);

// app.use('/api/v1/tours', tourRouter);
// app.use('/api/v1/users', userRouter);

// ///////////////////////////////////////////////////////////////////////////////////////////
// //Server.js

// module.exports = app;

// // 3 server
// const dotenv = require('dotenv');
// dotenv.config({ path: './config.env' });

// const app = require('./app');

// // Showing the enviroment we are on.
// // console.log(app.get('env'));
// // console.log(process.env);

// const port = process.env.PORT || 3000;
// app.listen(port, () => {
//   console.log(`App is running on port ${port}...`);
// });
