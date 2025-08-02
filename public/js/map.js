    // let mapToken = mapToken;
	console.log(mapToken);
    mapboxgl.accessToken = mapToken;
    const map = new mapboxgl.Map({
        container: 'map', // container ID
        style: "mapbox://styles/mapbox/streets-v12", //dark-v11
        center: listing.geometry.coordinates, // starting position [lng, lat]. Note that lat must be set between -90 and 90
        zoom: 9 // starting zoom
    });

    // console.log(listing.geometry.coordinates);

    // Create a default Marker and add it to the map.
    const marker = new mapboxgl.Marker({color: "red"})
        .setLngLat(listing.geometry.coordinates)  //Listing.geometry.coordinates
        
        // .setPopup(new mapboxgl.Popup({offset: 25}))
        // .setHTML(`<h4>${listing.location}</h4><p>Exact Location will be provided after booking</p>`)

        .addTo(map);


        const popup = new mapboxgl.Popup({ offset: 25 })
        .setHTML(`<h4>${listing.location}</h4><p>Exact Location will be provided after booking</p>`);
    
    // Set the Popup for the marker
    marker.setPopup(popup);   // Attach the popup to the marker
    
