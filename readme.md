<!-- Natour Application -->

build using modern tech : nodejs, express, mongoDB, mongoose .

- Bundler :
  1- npm i parcel-bundler --save-dev
  2- script(src='/js/bundle.js')
  3- in package.json file --> "watch:js": "parcel watch ./public/js/index.js --out-dir ./public/js --out-file bundle.js",
  "build:js": "parcel watch ./public/js/index.js --out-dir ./public/js --out-file bundle.js"

4- open new terminal then write --> npm run watch:js
