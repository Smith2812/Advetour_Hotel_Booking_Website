mapboxgl.accessToken = maptoken;

const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/dark-v11',
    center: staycity.geometry.coordinates,
    zoom: 5,
});

map.addControl(new mapboxgl.NavigationControl());



hotels.forEach(hotel => {
    // Create a new div element for the marker
    const el = document.createElement('div');
    el.className = 'marker';
    el.style.backgroundImage = 'url(https://cdn-icons-png.flaticon.com/128/5145/5145226.png)'; // Set your custom icon URL here
    el.style.width = '30px'; // Set the width of your custom icon
    el.style.height = '30px'; // Set the height of your custom icon
    el.style.backgroundSize = 'cover';

    // Create a marker with the custom element
    const marker = new mapboxgl.Marker(el)
        .setLngLat(hotel.geometry.coordinates)
        .setPopup(
            new mapboxgl.Popup({offset: 2})
                .setHTML(
                    `<div class="card" style="width: 100%;">
                        <img src="${hotel.images[0].url}" class="card-img-top" alt="${hotel.title}">
                        <div class="card-body">
                            <p class="card-title fs-8 text-wrap"  >${hotel.title}</p>
                            <p class="card-text">₹ ${hotel.newprice}</p>
                        </div>
                    </div>`
                )
        )
        .addTo(map);
});

