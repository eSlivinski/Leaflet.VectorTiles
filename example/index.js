/**
 *
 */


fetch('/geojson')
  .then(res => res.json())
  .then(main);


function main(geojson) {
  const countries = geojson.features.map(f => f.properties.name.toLowerCase());

  const map = L.map('map', {
    center: {
      lat: 0,
      lng: 0
    },
    zoom: 2
  });

  L.tileLayer('http://tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

  const url = '/{z}/{x}/{y}';

  const vtLayer = new L.VectorTiles(url, {
    getFeatureId: f => f.properties.name.toLowerCase(),
    style: {}
  }).addTo(map);

  var hoverHighlight = false;

  function highlightOnHover(e) {
    // reset all feature styles
    for (let i = 0; i < countries.length; i++) {
      vtLayer.setFeatureStyle(countries[i], Object.assign(L.Path.prototype.options, { fill: true }));
    }
    const buf = .00001;
    const { lat, lng } = e.latlng;
    vtLayer.search(
      L.latLng({ lat: lat - buf, lng: lng - buf }),
      L.latLng({ lat: lat + buf, lng: lng + buf })
    ).forEach(id => vtLayer.setFeatureStyle(id, { color: 'green' }));

  }

  document.getElementById('hover-radio').onclick = e => {
    hoverHighlight = !hoverHighlight;
    e.target.checked = hoverHighlight;
    map[hoverHighlight ? 'on' : 'off']('mousemove', highlightOnHover);
  };

  document.getElementById('search').onkeyup = e => {
    // reset all feature styles
    for (let i = 0; i < countries.length; i++) {
      vtLayer.setFeatureStyle(countries[i], Object.assign(L.Path.prototype.options, { fill: true }));
    }
    const q = e.target.value.toLowerCase();
    if (!q) {
      return;
    }
    countries
      .filter(c => c.indexOf(q) > -1)
      .forEach(id => vtLayer.setFeatureStyle(id, { color: 'black' }));
  };
}
