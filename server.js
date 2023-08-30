const mongoose = require('mongoose');
const dotenv = require('dotenv'); //  --> Enviroment variable...need to be before ./app file.

process.on('uncaughtException', (err) => {
  console.log('UNHANDELED EXCEPTION! 💥💥💥 Shutting down...');
  // console.log(err.name, err.message);
  console.log(err); // printing the entire error.
});

const app = require('./app.js'); // -> express application.
dotenv.config({ path: './config.env' });
// // Showing the enviroment we are on.// console.log(app.get('env'));// console.log(process.env);

// //replacing the PASSWORD with real one.
const DB = process.env.DATABASE.replace(
  '<DATABASE_PASSWORD>',
  process.env.DATABASE_PASSWORD
);

// //  1: Connecting to the database.
mongoose
  .connect(
    DB
    // {    // .connect(process.env.DATABASE_LOCAL, {    //this is options to deal with warnings.    // useNewUrlParsers: true,    // useCreateIndex: true,    // useFindAndModify: false    // }
  )
  .then((connectionObj) => {
    // console.log(connectionObj.connections);
    console.log(
      'DB connections successfully connected : '
      //, connectionObj.connections
    );
  });
// .catch((err) => console.log('Error'));

const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log(`App is running on port ${process.env.PORT}...`);
});

process.on('unhandledRejection', (err) => {
  console.log(err.name, err.message);
  // console.log(err); // printing the entire error.
  console.log('UNHANDELED REJECTION! 💥💥💥 Shutting down...');
  server.close(() => {
    process.exit(1); // 0 = success , 1 = uncaught exception.
  });
});

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// const mongoose = require('mongoose');// const dotenv = require('dotenv');  //  --> Enviroment variable...need to be before ./app file.// const app = require('./app');  // -> express application.
// dotenv.config({ path: './config.env' });
// //replacing the PASSWORD with real one.// const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD);
// //Connecting to the database.// mongoose// .connect(DB, {// // .connect(process.env.DATABASE_LOCAL, {
//     //this is options to deal with warnings.//     // useNewUrlParsers: true,//     // useCreateIndex: true,//     // useFindAndModify: false// }).then(connectionObj => {//     // console.log(connectionObj.connections);//     console.log('DB connections successfully connected');// });
// //knowing what ENVIROMENT we are developing inside it..// // console.log(app.get('env'));  // --> by express.// //console.log(process.env); // --> by Node.js
// //////////////////////////////// ////////////////////////////////// Server Start// /////////////////////////////
// //the port should be the one coming from thr eviromnet variable or this 8000.// const port =process.env.PORT || 8000;// app.listen(port, () => {//     console.log(`Listening on port ${port}`);// });
