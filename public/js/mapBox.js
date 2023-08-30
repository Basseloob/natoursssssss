// javascript code will integrate with html that runs in the clien  side :
// console.log('Hello from the client side in mapBox.js   ');
// const locations = JSON.parse(document.getElementById('map').dataset.locations); // dataset.loactions; coming ---> from tour.pug --> #map(data-locations=`${JSON.stringify(tour.locations)}`)
// console.log(locations);

// exported into ./index.js
export const displayMap = (locations) => {
  // From MabBox website :
  mapboxgl.accessToken =
    'pk.eyJ1IjoiYmFzc2Vsb29iIiwiYSI6ImNsbGpkcjQwZzBxZ2szY3Q2ejhkN2VlYTEifQ.kJXrpBOSC4RUAkV6xQroQg';

  var map = new mapboxgl.Map({
    container: 'map', // the id
    style: 'mapbox://styles/basseloob/cllje965i00uv01qp9otf3iig',
    //   center: [-118.362151, 33.784423], // lng / lat
    //   zoom: 8,
    interactive: false,
  });

  // making the map automatically based in the tour place - it will point to :
  const bounds = new mapboxgl.LngLatBounds();

  // loobing through out all our locations to make a points in it in the map :
  locations.forEach((loc) => {
    // 1) Create Marker :
    const el = document.createElement('div');
    el.className = 'marker';

    // 2) Add marker :
    new mapboxgl.Marker({
      element: el,
      anchor: 'bottom',
    })
      .setLngLat(loc.coordinates) // coordinates --> is an array of Lng, Lat
      .addTo(map);

    // 3) Add PopUp :
    new mapboxgl.Popup({ offset: 30 })
      .setLngLat(loc.coordinates)
      .setHTML(`<p>Day ${loc.day}: ${loc.description}</p>`)
      .addTo(map);

    // 4) EXTEND map bound to include current location :
    bounds.extend(loc.coordinates);
  });

  map.fitBounds(bounds, {
    padding: {
      top: 200, // px
      bottom: 200,
      left: 100,
      right: 100,
    },
  });
};
