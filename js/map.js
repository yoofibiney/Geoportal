// initialize map
var map = L.map('map').setView([7.6, -0.09], 8);

// add basemap to map
var osm = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

var googleStreets = L.tileLayer('http://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}',{
    maxZoom: 20,
    subdomains:['mt0','mt1','mt2','mt3']
	});
var googleHybrid = L.tileLayer('http://{s}.google.com/vt/lyrs=s,h&x={x}&y={y}&z={z}',{
    maxZoom: 20,
    subdomains:['mt0','mt1','mt2','mt3']
 	});  

var googleSat = L.tileLayer('http://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}',{
    maxZoom: 20,
    subdomains:['mt0','mt1','mt2','mt3']
    });

var googleTerrain = L.tileLayer('http://{s}.google.com/vt/lyrs=p&x={x}&y={y}&z={z}',{
    maxZoom: 20,
    subdomains:['mt0','mt1','mt2','mt3']
    });

var marker = L.marker([7.6,-0.09]).addTo(map);

// adding style to region layer

 var regionstyle = {
 	color: 'black',
 	opacity: 0.25,
    weight:1.5,
    fillColor: 'green'
 }

// adding style to health layer
 var healthstyle = {
 	radius: 6,
 	fillColor : 'yellow',
    color : 'black',
    weight : 1
 }

// adding style to railway layer
 var railwaystyle = {
 		weight:2,
 		color: 'magenta',
 		opacity:1
 }



	// add Geojson Layers
 var regionlayer = L.geoJson(Region,{
    style:regionstyle,
    onEachFeature: function (feature, layer) {
    		area = (turf.area(feature)/1000000).toFixed(3)
    		center_lng = turf.center(feature).geometry.coordinates[0].toFixed(3)
    		center_lat = turf.center(feature).geometry.coordinates[1].toFixed(3)
    		//console.log(center)

    	label = `Name: ${feature.properties.region}<br>`
    	label += `Area: ${area}<br>`
    	label += `Center: Lng: ${center_lng}, Lat: ${center_lat} <br>`

    	layer.bindPopup(label)
    }
	}).addTo(map)

var healthlayer = L.geoJson(Health, {
 	pointToLayer: function(feature, latlng) {return L.circleMarker(latlng,healthstyle)},
 	onEachFeature: function (feature, layer) {
    	layer.bindPopup(feature.properties.amenity)
    }
 }).addTo(map)


 var railwaylayer = L.geoJson(Railway,{style:railwaystyle,
      onEachFeature: function (feature, layer) {
    	layer.bindPopup(feature.properties.NAME)
    }
 }).addTo(map)



// adding wms layers
var riverWMS = L.tileLayer.wms("http://localhost:8080/geoserver/Geospatial/wms", {
   layers: '	Geospatial:water_bodies',
   format: 'image/png',
    transparent: true,
     attribution: ''
}).addTo(map)

var airportWMS = L.tileLayer.wms("http://localhost:8080/geoserver/Geospatial/wms", {
    layers: '	Geospatial:airport',
    format: 'image/png',
    transparent: true,
     attribution: ''
}).addTo(map)


var pointOfInterest = L.tileLayer.wms("http://localhost:8080/geoserver/Geospatial/wms", {
    layers: '	Geospatial:Point_Of_Interest',
    format: 'image/png',
    transparent: true,
     attribution: ''
}).addTo(map)

var treeCoverWMS = L.tileLayer.wms("http://localhost:8080/geoserver/Geospatial/wms", {
    layers: '	Geospatial:Savannah_tree_cover',
    format: 'image/png',
    transparent: true,
     attribution: ''
})//.addTo(map)


// adding basemaps
var baseLayers = {
    "OpenStreetMap": osm,
    "Google Streets": googleStreets,
    "Google Hybrid": googleHybrid,
    "Google Satellite": googleSat,
    "Google Terrain": googleTerrain,
};

// add layers
var overlays = {
   "Marker": marker,
   'Region': regionlayer,
   'Health Facilities': healthlayer,
   'Railway': railwaylayer,
   'Point Of Interest': pointOfInterest,
   'Rivers': riverWMS,
   'Airport': airportWMS,
   'Tree Cover': treeCoverWMS,
    //"Roads": roadsLayer
};

L.control.layers(baseLayers, overlays, {collapsed:false}).addTo(map);

// add leaflet browser print control to map

L.control.browserPrint({position: 'topleft'}).addTo(map);

// mouse mover

map.on('mousemove', function(e)
		{ $('#coordinate').html(`Lat: ${e.latlng.lat.toFixed(3)}, Lng: ${e.latlng.lng.toFixed(3)}`)
	})


var scale = L.control.scale({position:'bottomleft'}).addTo(map);