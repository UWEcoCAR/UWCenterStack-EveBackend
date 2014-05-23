/**
 * A MapManager for plotting location based efficiency on top of a google maps map
 * 
 *
 *
 *
 */

var MapManager = function (currentLocation, width, height) {
    this.WIDTH = 400;
    this.HEIGHT = 400;
    this.location = currentLocation;
    this.MAP_ID = "MapManager-map";
    this.CANVAS_ID = "MapManager-canvas";

    this.getMap = function() {
        var container = $('<div style="position:relative;"></div>');
        this.canvas = $('<canvas>', {
            "id": this.CANVAS_ID,
            css: {
                "position": "absolute",
                "z-index": "200",
                "width": this.WIDTH + "px",
                "height": this.HEIGHT + "px",
                "pointer-events": "none"
            }
        }).appendTo(container);

        this.map = $("<div>", {
            "id": this.MAP_ID,
            css: {
                "position": "absolute",
                "z-index": "100",
                "width": this.WIDTH + "px",
                "height": this.HEIGHT + "px"
            }
        }).appendTo(container);


        this.directionsDisplay = new google.maps.DirectionsRenderer();
        // TODO query for current location, return map around that location
        var seattle = new google.maps.LatLng(47.6097, -122.3331);
        var mapOptions = {
            zoom: 6,
            center: seattle,
            mapTypeControlOptions: {
                mapTypeIds: [google.maps.MapTypeId.ROADMAP, 'usroadatlas']
            }
        }

        this.googleMapsMap = new google.maps.Map(this.map.get(0), mapOptions);
        this.directionsDisplay.setMap(this.googleMapsMap);
        
        var roadAtlasStyles = [{
              "featureType": "road.highway",
              "elementType": "geometry",
              "stylers": [
                { "saturation": -100 },
                { "lightness": -8 },
                { "gamma": 1.18 }
              ]
          }, {
              "featureType": "road.arterial",
              "elementType": "geometry",
              "stylers": [
                { "saturation": -100 },
                { "gamma": 1 },
                { "lightness": -24 }
              ]
          }, {
              "featureType": "poi",
              "elementType": "geometry",
              "stylers": [
                { "saturation": -100 }
              ]
          }, {
              "featureType": "administrative",
              "stylers": [
                { "saturation": -100 }
              ]
          }, {
              "featureType": "transit",
              "stylers": [
                { "saturation": -100 }
              ]
          }, {
              "featureType": "water",
              "elementType": "geometry.fill",
              "stylers": [
                { "saturation": -100 }
              ]
          }, {
              "featureType": "road",
              "stylers": [
                { "saturation": -100 },
                { "lightness": -30 }
              ]
          }, {
              "featureType": "administrative",
              "stylers": [
                { "saturation": -100 }
              ]
          }, {
              "featureType": "landscape",
              "stylers": [
                { "saturation": -100 }
              ]
          }, {
              "featureType": "poi",
              "stylers": [
                { "saturation": -100 }
              ]
          }];

          var styledMapOptions = {};

          var usRoadMapType = new google.maps.StyledMapType(
              roadAtlasStyles, styledMapOptions);

          this.googleMapsMap.mapTypes.set('usroadatlas', usRoadMapType);
          this.googleMapsMap.setMapTypeId('usroadatlas');

        // add event listeners
        var me = this;
        // google.maps.event.addListener(this.googleMapsMap, 'center_changed', function() {
        //     me.clearCanvas();
        //     //me.showEfficiency(function() {});
        // });

        google.maps.event.addListener(this.googleMapsMap, 'zoom_changed', function() {
            me.clearCanvas();
        })

        // google.maps.event.addListener(this.googleMapsMap, 'bounds_changed', function() {
        //     me.clearCanvas();
        //     //me.showEfficiency(function() {});
        // });



        this.canvas.get(0).fillStyle = "rgba(255, 255, 255, 0.5)";
        this.context = this.canvas.get(0).getContext('2d');
        this.canvas.get(0).width = this.WIDTH;
        this.canvas.get(0).height = this.HEIGHT;
        return container;
    }

    this.showEfficiency = function(currentLocation, callback) {
        this.clearCanvas();
        var me = this;
        me.googleMapsMap.setCenter(new google.maps.LatLng(currentLocation.location.lat, currentLocation.location.long));

        var start = new Date().getTime();

        $.ajax({
            url: "/getDataPoints",
            type: 'GET'
        }).done(function (data) {
            var end = new Date().getTime();
            console.log('milliseconds passed', end - start);

            var bounds = me.googleMapsMap.getBounds();
            var topLeft = bounds.getNorthEast();
            var bottomRight = bounds.getSouthWest();
            var left = topLeft.lng();
            var top = topLeft.lat();
            var right = bottomRight.lng();
            var bottom = bottomRight.lat();
            var height = Math.abs(top - bottom);
            var width = Math.abs(left - right);

            var canvasWidth = me.canvas.get(0).width;
            var canvasHeight = me.canvas.get(0).height;

            console.log("canvas height: " + canvasHeight + " canvas width: " + canvasWidth);
            var zoom = me.googleMapsMap.getZoom();
            var radius = Math.pow(1.18, zoom);

            _.each(data, function (point) {
                var latLng = new google.maps.LatLng(point.location.lat, point.location.long);
                if (bounds.contains(latLng)) { // this point lies in the map, plot it on the canvas!
                    // calculate distance from top left
                    var fromTop = Math.abs(top - point.location.lat);
                    var fromLeft =  Math.abs(left - point.location.long);
                    var ratioTop = fromTop / height;
                    var ratioLeft = fromLeft / width;

                    var centerX = canvasWidth - Math.floor(ratioLeft * canvasWidth);
                    var centerY = Math.floor(ratioTop * canvasHeight);

                    me.context.beginPath();
                    me.context.arc(centerX, centerY, radius, 0, 2 * Math.PI, false);
                    me.context.shadowBlur = 4;
                    me.context.fillStyle = me.calculateColor(Math.floor((Math.random() * 10) + 1));
                    me.context.fill();
                    me.context.closePath();
                }
            });
            callback();
        });
    }

    this.calculateColor = function(efficiency) {
        var efficiency = parseInt(efficiency);

        if (efficiency > 5) {
            return 'rgba(255, 0, 0, 0.01)';
        } else {
            return 'rgba(0, 0, 255, 0.01)';
        }
    }

    this.clearCanvas = function() {
        this.context.clearRect(0, 0, this.canvas.get(0).width, this.canvas.get(0).height);
    }
}