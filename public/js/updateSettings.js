// this file is for API calls from the frontend :
// updateSetting --> is for the password and email .

import axios from 'axios';
import { showAlert } from './alerts';

// Update data : exported to index.js
// type is either 'PASSWORD' or 'data'
export const updateSettings = async (data, type) => {
  try {
    const url =
      type === 'password'
        ? 'http://127.0.0.1:3000/api/v1/users/updateMyPassword'
        : 'http://127.0.0.1:3000/api/v1/users/updateMe';

    // http request :
    const res = await axios({
      method: 'PATCH',
      url,
      //   data --> is the body that will be sent along with the request :
      data,
    });

    if (res.data.status === 'success') {
      console.log('user data is updated ');
      showAlert('success', `${type.toUpperCase()} Data updated successfully`);

      // Refreshing the page after pressing SAVE SETTING  in the account.pug :
      window.setTimeout(() => {
        location.reload();
      }, 500);
    }
  } catch (err) {
    console.log('updateSettings error : ', err);
    showAlert('error', err.response.data.message);
  }
};

// Update data : exported to index.js
// export const updateData = async (name, email) => {
//   try {
//     // http request :
//     const res = await axios({
//       method: 'PATCH',
//       url: 'http://127.0.0.1:3000/api/v1/users/updateMe',
//       //   data --> is the body that will be sent along with the request :
//       data: {
//         name,
//         email,
//       },
//     });

//     if (res.data.status === 'success') {
//       console.log('user data is updated ');
//       showAlert('success', 'Data updated successfully');
//     }
//   } catch (err) {
//     showAlert('error :', err.response.data.message);
//   }
// };
