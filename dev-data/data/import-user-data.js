// const fs = require('fs');
// const mongoose = require('mongoose');
// const dotenv = require('dotenv'); //  --> Enviroment variable...need to be before ./app file.
// const userModel = require('../../models/userModel');
// const { dir } = require('console');
// const { dirname } = require('path');

// dotenv.config({ path: './config.env' });

// // // Showing the enviroment we are on.
// // console.log(app.get('env'));
// // console.log(process.env);
// // //replacing the PASSWORD with real one.
// const DB = process.env.DATABASE.replace(
//   '<PASSWORD>',
//   process.env.DATABASE_PASSWORD
// );
// // //  1: Connecting to the database.
// mongoose
//   .connect(
//     DB
//     // {    // .connect(process.env.DATABASE_LOCAL, {    //this is options to deal with warnings.    // useNewUrlParsers: true,    // useCreateIndex: true,    // useFindAndModify: false    // }
//   )
//   .then((connectionObj) => {
//     // console.log(connectionObj.connections);
//     console.log(
//       'DB connections successfully connected : ' //, connectionObj.connections
//     );
//   });
// ////////////////////////////////////////////////////////////////////////////////////////////////////
// // Read JSON file ...............
// // const tours = JSON.parse(
// //   fs.readFileSync(`${__dirname}/tours-simple.json`, 'utf-8')
// // );
// const tours = JSON.parse(fs.readFileSync(`${__dirname}/users.json`, 'utf-8'));

// // IMPORT DATA INTO THE DATABASE
// const importData = async () => {
//   try {
//     await userModel.create(tours);
//     console.log('Data successfully loaded into database !');
//   } catch (err) {
//     console.log(err);
//   }
//   process.exit();
// };

// // DELETE ALL DATA FROM THE DATABASE COLLECTION
// const deleteData = async () => {
//   try {
//     await userModel.deleteMany();
//     console.log('Data successfully deleted from database !');
//   } catch (err) {
//     console.log(err);
//   }
//   process.exit();
// };
// if (process.argv[2] === '--import') {
//   importData();
// } else if (process.argv[2] === '--delete') {
//   deleteData();
// }
// console.log(process.argv);
