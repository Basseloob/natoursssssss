import axios from 'axios';
import { showAlert } from './alerts';

//exported into ./index.js
export const login = async (email, password) => {
  console.log('LOGIN');
  console.log(email, password);

  try {
    const res = await axios({
      method: 'POST',
      url: 'http://127.0.0.1:3000/api/v1/users/login',
      data: {
        email,
        password,
      },
    });

    if (res.data.status === 'success') {
      // alert('Loggedin successfully!');
      showAlert('success', 'Loggedin successfully!');

      window.setTimeout(() => {
        // Reloading the page to the home page after 1.5 seconds - after successfule login :
        location.assign('/');
      }, 1500);
    }

    // console.log(res);
  } catch (err) {
    // console.log('From Axios error Docs   : ', err.response.data);
    // alert(err.response.data.message);
    showAlert('error', err.response.data.message);
    // console.log(' login function error :', err);
  }
};

export const logOut = async () => {
  try {
    const res = await axios({
      method: 'GET',
      url: 'http://127.0.0.1:3000/api/v1/users/logout',
    });

    if ((res.data.status = 'success')) location.reload(true);
  } catch (err) {
    console.log(err.response);
    showAlert('error', 'Error logging out! try again');
  }
};
