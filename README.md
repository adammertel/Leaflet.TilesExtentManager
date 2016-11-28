# Leaflet.TilesExtentControl

**Simple leaflet plugin that will block downloading tiles that are overlaid by another layer**

### Motivation:
To enhance the leaflet performance in situations, where more overlapping tileLayers are displayed and loaded. This plugin calculates which tileLayer is not possible to be seen and temporary removes it from the map.


### How to use:
* load src/leaflet-tilesextentcontrol.js
* create an config array (seee TilesGroup Config section )
* call method ``map.createTilesExtentControlGroup(<TilesGroup Config>)``


### TilesGroup Config:
This is a js array that holds basic information about your TileLayers and their order. First elements have the highest priority and will be displayed in front. Each element is an object that holds this parameters:
 * name - this attribute is optional and would be used in the future
 * layer - L.TileLayer instance
 * bounds - polygon that defines extent of this layer. False if there are no boundaries
 * transparent - true, if we see through this layer


### Example
```
    // initialize tileLayers
    var OpenMapSurfer_Roads = L.tileLayer('http://korona.geog.uni-heidelberg.de/tiles/roads/x={x}&y={y}&z={z}', {  
        maxZoom: 20,
        attribution: 'Imagery from <a href="http://giscience.uni-hd.de/">GIScience Research Group @ University of Heidelberg</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    });

    var NLS = L.tileLayer('http://nls-{s}.tileserver.com/nls/{z}/{x}/{y}.png', {
    	attribution: '<a href="http://geo.nls.uk/maps/">National Library of Scotland Historic Maps</a>',
    	bounds: [[49.6, -12], [61.7, 3]],
    	minZoom: 1,
    	maxZoom: 18,
    	subdomains: '0123'
    });

    var map = L.map('map-wrapper', {
      center: [48, 13],
      zoom: 6
    });

    // definition of TilesGroup array
    var layers = [{
      name: 'NLS',
      layer: NLS,
      bounds: L.polygon([[50, -8], [50, 2], [60, 2], [60, -8], [50, -8]]),
      transparent: false
    },{
      name: 'OSM_surfer',
      layer: OpenMapSurfer_Roads,
      bounds: false,
      transparent: false
    }];

    // adding TilesGroup to map
    map.createTilesExtentControlGroup(layers);
```


### Notes
The aim of this plugin is save requests on tiles that are not possible to display. On the other hand, it needs a calculation on each map change. This calculation does not take long time (in most cases < 2ms) but it means that this plugin is recomended only in specific situations:
 - when more tilesLayers with different extent are loaded at the same time
 - when server where tiles are hosted is slow
 - when users have slower internet connection

This plugin is not fully tested yet. There are also more things to be implemented.
