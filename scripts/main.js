var directionsDisplay;
var directionsService = new google.maps.DirectionsService();
var map;
var currentPoints = [];

var fromColor = { // yellow
  red: 208,
  green: 221,
  blue: 40
};

var toColor = { // purple
  red: 102,
  green: 45,
  blue: 145
};

//google.maps.event.addDomListener(window, 'load', initialize);
$(window).load(function() {
  directionsDisplay = new google.maps.DirectionsRenderer();
  var seattle = new google.maps.LatLng(47.6097, -122.3331);
  var mapOptions = {
    zoom: 6,
    center: seattle,
    mapTypeControlOptions: {
        mapTypeIds: [google.maps.MapTypeId.ROADMAP, 'usroadatlas']
    }
  }

  map = new google.maps.Map($('#map')[0], mapOptions);

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

  var styledMapOptions = {

  };

  var usRoadMapType = new google.maps.StyledMapType(
      roadAtlasStyles, styledMapOptions);

  map.mapTypes.set('usroadatlas', usRoadMapType);
  map.setMapTypeId('usroadatlas');

  directionsDisplay.setMap(map);
});

function calcRoute() {
  var start = $('#start').val(); //document.getElementById('start').value;
  var end = $('#end').val();//document.getElementById('end').value;
  var waypts = [];
  $('#waypoints option:selected').each(function(num, el) {
    waypts.push({
        location: $(el).val(),
        stopover: true
    });
  });

  var request = {
      origin: start,
      destination: end,
      waypoints: waypts,
      optimizeWaypoints: true,
      travelMode: google.maps.TravelMode.DRIVING
  };

  directionsService.route(request, function(response, status) {
    if (status == google.maps.DirectionsStatus.OK) {
      directionsDisplay.setDirections(response);
      var route = response.routes[0];
      var summaryPanel = $('#directions')[0];
      summaryPanel.innerHTML = '';
      // For each route, display summary information.
      for (var i = 0; i < route.legs.length; i++) {
        var routeSegment = i + 1;
        summaryPanel.innerHTML += '<b>Route Segment: ' + routeSegment + '</b><br>';
        summaryPanel.innerHTML += route.legs[i].start_address + ' to ';
        summaryPanel.innerHTML += route.legs[i].end_address + '<br>';
        summaryPanel.innerHTML += route.legs[i].distance.text + '<br><br>';
      }
    }
  });
}


function addEfficiency() {
  // LAT/LONG Data
  /*
  var routeCoordinates = [
    new google.maps.LatLng(47.654109, -122.304331), // eco car lab
    new google.maps.LatLng(47.654127, -122.305130),
    new google.maps.LatLng(47.654961, -122.304653),
    new google.maps.LatLng(47.654940, -122.304642),
    new google.maps.LatLng(47.655821, -122.304556),
    new google.maps.LatLng(47.656812, -122.304814),
    new google.maps.LatLng(47.657830, -122.304578),
    new google.maps.LatLng(47.658437, -122.305543),
    new google.maps.LatLng(47.659044, -122.306445),
    new google.maps.LatLng(47.659558, -122.307249),
    new google.maps.LatLng(47.659767, -122.308376),
    new google.maps.LatLng(47.659717, -122.309288) // stevens and 17th
  ];

  var to45th = [
    new google.maps.LatLng(47.659717, -122.309288), // stevens and 17th
    new google.maps.LatLng(47.660121, -122.309572),
    new google.maps.LatLng(47.660728, -122.309577),
    new google.maps.LatLng(47.661194, -122.309561),
    new google.maps.LatLng(47.661263, -122.310221),
    new google.maps.LatLng(47.661263, -122.311106),
    new google.maps.LatLng(47.661270, -122.311879) // 45th and 15th
  ];

  var toGrant = [
    new google.maps.LatLng(47.661270, -122.311879), // 45th and 15th
    new google.maps.LatLng(47.661046, -122.311959),
    new google.maps.LatLng(47.660721, -122.311970),
    new google.maps.LatLng(47.660230, -122.312002),
    new google.maps.LatLng(47.659666, -122.312034),
    new google.maps.LatLng(47.659001, -122.312067),
    new google.maps.LatLng(47.658503, -122.312088),
    new google.maps.LatLng(47.657599, -122.312099),
    new google.maps.LatLng(47.656898, -122.312120),
    new google.maps.LatLng(47.656255, -122.312163),
    new google.maps.LatLng(47.655836, -122.312152),
    new google.maps.LatLng(47.655359, -122.312174) // 15th and Grant
  ];

  var toLab = [
    new google.maps.LatLng(47.655359, -122.312174), // 15th and Grant
    new google.maps.LatLng(47.655200, -122.311315),
    new google.maps.LatLng(47.654868, -122.310393),
    new google.maps.LatLng(47.654116, -122.310446),
    new google.maps.LatLng(47.653458, -122.310446),
    new google.maps.LatLng(47.652895, -122.310264),
    new google.maps.LatLng(47.652324, -122.309363),
    new google.maps.LatLng(47.652042, -122.308172),
    new google.maps.LatLng(47.652251, -122.306434),
    new google.maps.LatLng(47.652757, -122.305651),
    new google.maps.LatLng(47.653270, -122.305243),
    new google.maps.LatLng(47.653834, -122.305157),
    new google.maps.LatLng(47.654101, -122.305125) // entrance to lab
  ]; */

  $.ajax({
    url: "/getDataPoints",
    type: 'GET'
  }).done(function(data) {
    var startOfRoute = addEfficiencyDataToMap(data);
    if (startOfRoute) {
      map.setZoom(15);
      map.setCenter(startOfRoute);

      var summaryPanel = $('#directions')[0];
      summaryPanel.innerHTML = '';
      summaryPanel.innerHTML += '<b>Driving around campus</b><br>';
      summaryPanel.innerHTML += 'Starting at the EcoCAR lab and heading North!<br />';
    } else {
      alert("not enough data to route on the map");
    }

  });
}

function addEfficiencyDataToMap(data) {
  clearMap();
  attachOptions(data);
  var circle;
  var duplicate = 2;
  for (var i = 0; i < duplicate; i++) {
    _.each(data, function(point) {
      // Add the circle for this city to the map.
      circle = new google.maps.Circle(point.options);
      circle.setMap(map);
      currentPoints.push(circle);
      /*
      var location = new google.maps.LatLng(point.location.lat, point.location.long);
      var marker = new google.maps.Marker({
          position: location,
          map: map
      });
      marker.setMap(map);
      currentPoints.push(marker);
      */
    });
  }


  /*
  if (data.length < 3) {
    return null;
  }
  var avgEfficiency = -1;
  var i = 0;
  var min = 0;
  var max = -1;
  // place all of the data on the map!
  while (i < data.length - 2) {
    min = i;
    max = min + 1;
    avgEfficiency = (data[min].efficiency + data[max].efficiency) / 2;
    var change = 0;

    // group together until the efficiencies are too different (some threshold)
    while (change < 2 && max < data.length) {
      change = avgEfficiency - data[max].efficiency;
      max++;
    }
    max--;

    // need at least 3 points to make a line!
    if (max < 3) {
      max += 1;
    }

    if (max + 3 >= data.length) {
      max = data.length - 1;
    }

    // now I have a range of similar ones! Route it on the map
    avgEfficiency = 0;
    var routeCoordinates = [];
    for (var j = min; j <= max; j++) {
      avgEfficiency += data[j].efficiency;
      routeCoordinates.push(new google.maps.LatLng(data[j].location.lat, data[j].location.long));
    }
    avgEfficiency = avgEfficiency / (1 + max - min);
    var onePath = new google.maps.Polyline({
      path: routeCoordinates,
      geodesic: true,
      strokeColor: calculateColor(avgEfficiency),
      strokeOpacity: 1.0,
      strokeWeight: 3
    });
    onePath.setMap(map);
    currentPoints.push(onePath);
    i = max;
  }
  */
  return new google.maps.LatLng(data[0].location.lat, data[0].location.long);
}

function attachOptions(data) {
  //var resultRed, resultGreen, resultBlue;
  _.each(data, function(point) {
    var percent = point.efficiency / 100;
    var resultRed = Math.floor(fromColor.red + percent * (toColor.red - fromColor.red));
    var resultGreen = Math.floor(fromColor.green + percent * (toColor.green - fromColor.green));
    var resultBlue = Math.floor(fromColor.blue + percent * (toColor.blue - fromColor.blue));
    var color = rgbToHex(resultRed, resultGreen, resultBlue);
    point["options"] = {
      strokeColor: color,
      strokeOpacity: .9,
      strokeWeight: 1,
      fillColor: color,
      fillOpacity: 0.2,
      map: map,
      center: new google.maps.LatLng(point.location.lat, point.location.long),
      radius: 50
    }
  });
}

function rgbToHex(r, g, b) {
    return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}

function componentToHex(c) {
    var hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
}

function clearMap() {
  _.each(currentPoints, function(line) {
    line.setMap(null);
  });
  currentPoints = [];
}

function calculateColor(avg) {
  if (avg < 10) {
    console.log("black");
    return "#000000";
  } else if (avg < 15) {
    console.log("red");
    return "#FF0000";
  } else if (avg < 20) {
    console.log("green");
    return "#00FF00";
  } else {
    console.log("blue");
    return "#0000FF";
  }
}
