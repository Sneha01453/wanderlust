//  <script type="module">
    // let mapApiToken =mapToken;
    import {
        Map,
        NavigationControl,
        Marker,
        Popup
    } from "https://unpkg.com/maplibre-gl@6.3.0/dist/maplibre-gl.mjs";

    const myAPIKey = window.mapToken;
    const listing = window.listing;
    const coordinates = listing.geometry.coordinates;

    const map = new Map({
        container: "map",

        style: `https://maps.geoapify.com/v1/styles/klokantech-basic/style.json?apiKey=${myAPIKey}`,

        center: coordinates,

        zoom: 12
    });

    map.addControl(new NavigationControl());
const popup = new Popup({
    offset:35
}).setHTML(`<h4>${listing.title}</h4><p>Exact Location will provided after booking</p>`);

    new Marker({color:"red"})
        .setLngLat(coordinates)
        .setPopup(popup)
        .addTo(map);
// </script>


