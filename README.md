# Leaflet.TilesExtentManager

### Description:

Simple leaflet plugin that blocks downloading tiles that are overlaid by another layer.

### Motivation:

To enhance the leaflet performance in situations, when more overlapping L.TileLayers are loaded and displayed. This plugin calculates which L.TileLayer is not possible to be seen, and temporarily removes it from the map until the moment it can be seen.

### How to use:

* load src/leaflet-tilesextentmanager.js
* create a new TilesGroup config array (see TilesGroup Config section )
* call method `createTilesExtentManagerGroup(<TilesGroup Config>)` on map and pass your TilesGroup array

### TilesGroup Config:

Config is a structured js array that holds basic information about your L.TileLayers and their order. First elements have the highest priority and are display in front of other layers. Each element is an object that holds these parameters:

* **name** - this attribute is optional and would be (hopefully) used in the future
* **layer** - L.TileLayer instance
* **bounds** - a polygon that defines the extent of this layer. Is **false** when there are no boundaries
* **transparent** - true, if it is possible to see through this layer

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

 // initialize map
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
 map.createTilesExtentManagerGroup(layers);
```

### Notes

This plugin aims to save some server requests on tiles that are not possible to display. On the other hand, it needs a calculation on each map change (in most cases < 2ms); therefore, this plugin is recommended only in specific situations:

* when more tilesLayers with different extent are loaded at the same time
* when slow tile server
* when users have a slower internet connection
* when tiles have big size

### Schema

![Schema](schema.png 'Schema')