import '@babel/polyfill'; // to make it work in older browsers.
import { displayMap } from './mapBox';
import { login, logOut } from './login';
import { updateSettings } from './updateSettings';

console.log('Hello from PARCEL Bundler.................. in index.js');

// mapBox.js
// DOM elements
const mapBox = document.getElementById('map');
const loginForm = document.querySelector('.form--login');
const logOutBtn = document.querySelector('.nav__el--logout');
const userDataForm = document.querySelector('.form-user-data'); // in account.pug
const userPasswordForm = document.querySelector('.form-user-password'); // in account.pug

// DELEGATION
if (mapBox) {
  console.log('Hello from the client side in mapBox.js   ');
  const locations = JSON.parse(mapBox.dataset.locations); // dataset.loactions; coming ---> from tour.pug --> #map(data-locations=`${JSON.stringify(tour.locations)}`)
  console.log('locations  :  ', locations);

  displayMap(locations);
}

// login.js
if (loginForm) {
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault(); // preventing the form from loading any other page.
    // 1) Getting the input :
    const password = document.getElementById('password').value;
    const email = document.getElementById('email').value;

    login(email, password);
  });
}

// login.js
if (logOutBtn) logOutBtn.addEventListener('click', logOut);

if (userDataForm)
  userDataForm.addEventListener('submit', (e) => {
    e.preventDefault();
    // programatically recreate multipart :
    const form = new FormData();
    form.append('name', document.getElementById('name').value);
    form.append('email', document.getElementById('email').value);
    form.append('photo', document.getElementById('photo').files[0]);

    // 1) Getting the input :
    // const name = document.getElementById('name').value;
    // const email = document.getElementById('email').value;

    // updateSettings({ name, email }, 'data');
    updateSettings(form, 'data');
    console.log(form);
  });

if (userPasswordForm)
  userPasswordForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    // 1) Getting the input :
    const passwordCurrent = document.getElementById('password-current').value;
    const password = document.getElementById('password').value;
    const passwordConfirm = document.getElementById('password-confirm').value;

    await updateSettings(
      { passwordCurrent, password, passwordConfirm },
      'password'
    );
  });
