 /* Adam Mertel|UNIVIE */

(function(exports, global) {
    (function() {
        L.Map.include({
            options: {
                padding: .2
            },
            createTilesExtentControlGroup: function(tiles) {
                this.tilesGroup = tilesConfig;
                for (var li in this.tilesGroup) {
                    var layer = tilesGroup[li];
                    layer.layer.setZIndex(layers.length - li);
                    layer.layer.addTo(map);
                    layer.originalBounds = layer.layer.originalBounds;
                    layer.displayed = false;
                    layer.willdisplay = false;
                }
                this.on("moveend", function() {
                    this._refreshTilesGroup();
                });
                this._refreshTilesGroup();
            },
            _pointInsidePoints: function(point, vs) {
                var x = point.lat, y = point.lng;
                var inside = false;
                for (var i = 0, j = vs.length - 1; i < vs.length; j = i++) {
                    var xi = vs[i].lat, yi = vs[i].lng;
                    var xj = vs[j].lat, yj = vs[j].lng;
                    var intersect = yi > y != yj > y && x < (xj - xi) * (y - yi) / (yj - yi) + xi;
                    if (intersect) inside = !inside;
                }
                return inside;
            },
            _boundsVisible: function(mapBounds, polygon) {
                var visible = false;
                for (var bpi in boundsPoints) {
                    var boundsPoint = boundsPoints[bpi];
                    if (mapBounds.contains(boundsPoint)) {
                        visible = true;
                        break;
                    }
                }
                if (!visible) {
                    var cornersInside = [];
                    var mapCorners = [ mapBounds.getSouthWest(), mapBounds.getNorthEast(), mapBounds.getNorthWest(), mapBounds.getSouthEast() ];
                    for (var mc in mapCorners) {
                        cornersInside[mc] = this._pointInsidePoints(mapCorners[mc], boundsPoints);
                    }
                    visible = cornersInside.indexOf(true) != -1 && cornersInside.indexOf(false) != -1;
                }
                return visible;
            },
            _layerVisible: function(mapBounds, polygon) {
                return this._pointInsidePoints(mapBounds.getCenter(), polygon.getLatLngs()[0]);
            },
            _refreshTilesGroup: function() {
                var mapBounds = this.getBounds().pad(this.options.padding);
                var li, layer;
                for (li in this.tilesGroup) {
                    this.tilesGroup[li].willdisplay = false;
                }
                for (li in this.tilesGroup) {
                    layer = this.tilesGroup[li];
                    if (!layer.bounds) {
                        layer.willdisplay = true;
                        break;
                    } else {
                        if (mapBounds.intersects(layer.bounds.getBounds())) {
                            var visibleBounds = this._boundsVisible(mapBounds, layer.bounds);
                            var visibleLayer = false;
                            if (visibleBounds) {
                                visibleLayer = true;
                            } else {
                                visibleLayer = this._layerVisible(mapBounds, layer.bounds);
                            }
                            if (visibleLayer || visibleBounds) {
                                layer.willdisplay = true;
                                if (layer.transparent) {
                                    layer.willdisplay = true;
                                } else {
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
                            layer.layer.addTo(this);
                        } else {
                            layer.layer.removeFrom(this);
                        }
                    }
                    layer.displayed = _layer.willdisplay;
                }
            }
        });
    })();
    global[""] = exports;
})({}, function() {
    return this;
}());