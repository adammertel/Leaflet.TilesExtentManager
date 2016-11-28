(function(){

	//var mapProto = L.extend({}, L.Map.prototype);

	L.Map.include({

    createTilesExtentControlGroup: function (tilesConfig, options) {
			L.setOptions(this, options);
      this.tilesGroup = tilesConfig;

      for (var li in this.tilesGroup) {
        var layer = this.tilesGroup[li];
        layer.layer.setZIndex(this.tilesGroup.length - li);
        layer.layer.addTo(map);
        layer.originalBounds = layer.layer.originalBounds;
        layer.displayed = false;
        layer.willdisplay = false;
      }
			var that = this;
      this.on('moveend', function () {
        that._refreshTilesGroup();
      });
      this._refreshTilesGroup();
    },

    // ray-casting algorithm based on
    // http://www.ecse.rpi.edu/Homepages/wrf/Research/Short_Notes/pnpoly.html
    _pointInsidePoints: function (point, vs) {
      var x = point.lat,
          y = point.lng;
      var inside = false;
      for (var i = 0, j = vs.length - 1; i < vs.length; j = i++) {
        var xi = vs[i].lat,
            yi = vs[i].lng;
        var xj = vs[j].lat,
            yj = vs[j].lng;
        var intersect = yi > y != yj > y && x < (xj - xi) * (y - yi) / (yj - yi) + xi;
        if (intersect) inside = !inside;
      }
      return inside;
    },

    _boundsVisible: function (mapBounds, boundsPoints) {
      var visible = false;

      // is at least one vertex inside map bounds ?
      for (var bpi in boundsPoints) {
        var boundsPoint = boundsPoints[bpi];
        if (mapBounds.contains(boundsPoint)) {
          visible = true;
          break;
        }
      }
      // if not, check if mapCorners are not in the different sides of that polygon
      if (!visible) {
        var cornersInside = [];
        var mapCorners = [mapBounds.getSouthWest(), mapBounds.getNorthEast(), mapBounds.getNorthWest(), mapBounds.getSouthEast()];

        for (var mc in mapCorners) {
          cornersInside[mc] = this._pointInsidePoints(mapCorners[mc], boundsPoints);
        }
        visible = cornersInside.indexOf(true) != -1 && cornersInside.indexOf(false) != -1;
      }

      return visible;
    },

    _layerVisible: function (mapBounds, polygon) {
      return this._pointInsidePoints(mapBounds.getCenter(), polygon.getLatLngs()[0]);
      // var boundsPoints = polygon.getLatLngs()[0];
      //
      // var inside = false;
      //
      // var mapCorners = [mapBounds.getCenter(), mapBounds.getSouthWest(), mapBounds.getNorthEast(), mapBounds.getNorthWest(), mapBounds.getSouthEast()];
      //
      // for (var mc in mapCorners) {
      //   if (this._pointInsidePoints(mapCorners[mc], boundsPoints)) {
      //     inside = true;
      //     break;
      //   }
      // }
      //
      // return inside;
    },

    _refreshTilesGroup: function () {
      // map bounds are extended so polygon bounds has not to be so precise
      var mapBounds = this.getBounds().pad(this.options.padding);
      var li, layer;

      // setting all layers off as an initial state
      for (li in this.tilesGroup) {
        this.tilesGroup[li].willdisplay = false;
      }

      // iterating ordered layers
      for (li in this.tilesGroup) {
        layer = this.tilesGroup[li];

        // if layer has no bounds we do not need to check it - but other layers will not be checked
        if (!layer.bounds) {
          layer.willdisplay = true;
          break;
        } else {

          if (mapBounds.intersects(layer.bounds.getBounds())) {
            // if there is a chance to display

            var visibleBounds = this._boundsVisible(mapBounds, layer.bounds.getLatLngs());
            var visibleLayer = false;
            if (visibleBounds) {
              visibleLayer = true;
            } else {
              visibleLayer = this._layerVisible(mapBounds, layer.bounds);
            }

            // if layer should be displayed
            if (visibleLayer || visibleBounds) {
              layer.willdisplay = true;

              // if the layer is transparent, we have to continue with the iteration
              if (layer.transparent) {
                layer.willdisplay = true;
              } else {
                // we can break the iteration when we do not see borders and layer is not transparent
                if (!visibleBounds) {
                  break;
                }
              }
            }
          }
        }
      }

      for (li in this.tilesGroup) {
        layer = this.tilesGroup[li];
        if (layer.willdisplay != layer.display) {
          if (layer.willdisplay) {
            //_layer.layer.bounds = [[0,0], [0,0]]
            layer.layer.addTo(this);
          } else {
            //_layer.layer.bounds = _layer.originalBounds;
            layer.layer.removeFrom(this);
          }
        }
        layer.displayed = layer.willdisplay;
      }
    }

  });
})();
