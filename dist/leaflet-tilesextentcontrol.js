!function(i,t){!function(i,t){!function(){L.Map.include({createTilesExtentControlGroup:function(i,t){this.options.padding=.2,L.setOptions(this,t),this.tilesGroup=i;for(var s in this.tilesGroup){var n=this.tilesGroup[s];n.layer.setZIndex(this.tilesGroup.length-s),n.originalBounds=n.layer.originalBounds,n.displayed=!1,n.willdisplay=!1,n.transparent=n.transparent||!1,n.bounds=n.bounds||n.layer.bounds||!1}var e=this;this.on("moveend",function(){e._refreshTilesGroup()}),this._refreshTilesGroup()},_pointInsidePoints:function(i,t){for(var s=i.lat,n=i.lng,e=!1,o=0,r=t.length-1;o<t.length;r=o++){var l=t[o].lat,a=t[o].lng,u=t[r].lat,p=t[r].lng;a>n!=p>n&&s<(u-l)*(n-a)/(p-a)+l&&(e=!e)}return e},_boundsVisible:function(i,t){var s=!1;for(var n in t){var e=t[n];if(i.contains(e)){s=!0;break}}if(!s){var o=[],r=[i.getCenter(),i.getSouthWest(),i.getNorthEast(),i.getNorthWest(),i.getSouthEast()];for(var l in r)o[l]=this._pointInsidePoints(r[l],t);s=o.indexOf(!0)!=-1&&o.indexOf(!1)!=-1}return s},_layerVisible:function(i,t){return this._pointInsidePoints(i.getCenter(),t.getLatLngs()[0])},_isLayerWithinZoom:function(i){var t=parseInt(i.layer.options.minZoom||1),s=parseInt(i.layer.options.maxZoom||40),n=parseInt(this._zoom);return!(n<t||n>s)},_refreshTilesGroup:function(){var i,t,s=this.getBounds().pad(this.options.padding);for(i in this.tilesGroup)this.tilesGroup[i].willdisplay=!1;for(i in this.tilesGroup)if(t=this.tilesGroup[i],this._isLayerWithinZoom(t))if(t.bounds){if(s.intersects(t.bounds.getBounds())){var n=this._boundsVisible(s,t.bounds.getLatLngs()[0]),e=!1;if(n||(e=this._layerVisible(s,t.bounds)),e||n)if(t.willdisplay=!0,t.transparent)t.willdisplay=!0;else if(!n)break}}else if(t.willdisplay=!0,!t.transparent)break;for(i in this.tilesGroup)t=this.tilesGroup[i],t.willdisplay!=t.display&&(t.willdisplay?(console.log(i),t.layer.addTo(this)):t.layer.removeFrom(this)),t.displayed=t.willdisplay}})}(),t[""]=i}({},function(){return this}()),t[""]=i}({},function(){return this}());