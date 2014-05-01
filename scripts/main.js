var directionsDisplay;
var directionsService = new google.maps.DirectionsService();
var map;

//google.maps.event.addDomListener(window, 'load', initialize);
$(window).load(function() {
  directionsDisplay = new google.maps.DirectionsRenderer();
  var seattle = new google.maps.LatLng(47.6097, -122.3331);
  var mapOptions = {
    zoom: 6,
    center: seattle
  }

  map = new google.maps.Map($('#map')[0], mapOptions);
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
  // var routeCoordinates = [
  //   new google.maps.LatLng(47.654109, -122.304331), // eco car lab
  //   new google.maps.LatLng(47.654127, -122.305130),
  //   new google.maps.LatLng(47.654961, -122.304653),
  //   new google.maps.LatLng(47.654940, -122.304642),
  //   new google.maps.LatLng(47.655821, -122.304556),
  //   new google.maps.LatLng(47.656812, -122.304814),
  //   new google.maps.LatLng(47.657830, -122.304578),
  //   new google.maps.LatLng(47.658437, -122.305543),
  //   new google.maps.LatLng(47.659044, -122.306445),
  //   new google.maps.LatLng(47.659558, -122.307249),
  //   new google.maps.LatLng(47.659767, -122.308376),
  //   new google.maps.LatLng(47.659717, -122.309288) // stevens and 17th
  // ];

  $.ajax({
    url: "/getDataPoints",
    type: 'GET'
  }).done(function(data) {
    console.log("data returned" + data);
    var routeCoordinates = [];
    for (var i = 0; i < data.length; i++) {
      routeCoordinates.push(new google.maps.LatLng(data[i].location.lat, data[i].location.long));
    }
    var firstPath = new google.maps.Polyline({
      path: routeCoordinates,
      geodesic: true,
      strokeColor: calculateColor(data, 0, data.length),
      strokeOpacity: 1.0,
      strokeWeight: 3
    });
    firstPath.setMap(map);

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
    ];



    var secondPath = new google.maps.Polyline({
      path: to45th,
      geodesic: true,
      strokeColor: '#FFA500',
      strokeOpacity: 1.0,
      strokeWeight: 3
    });

    var thirdPath = new google.maps.Polyline({
      path: toGrant,
      geodesic: true,
      strokeColor: '#008000',
      strokeOpacity: 1.0,
      strokeWeight: 3
    });

    var fourthPath = new google.maps.Polyline({
      path: toLab,
      geodesic: true,
      strokeColor: '#FFFF00',
      strokeOpacity: 1.0,
      strokeWeight: 3
    });


    secondPath.setMap(map);
    thirdPath.setMap(map);
    fourthPath.setMap(map);


    // zoom to start of the route
    map.setZoom(14);
    map.setCenter(routeCoordinates[0]);

    var summaryPanel = $('#directions')[0];
    summaryPanel.innerHTML = '';
    summaryPanel.innerHTML += '<b>Driving around campus</b><br>';
    summaryPanel.innerHTML += 'Starting at the EcoCAR lab and heading North!<br />';
  });
}

function calculateColor(data, low, high) {
  var avg = 0;
  for (var i = low; i < high; i++) {
    avg += data[i].efficiency;
    console.log("data pt", data[i]);
  }
  avg = avg/(high - low);
  console.log("average", avg);

  if (avg < 10) {
    return "#000000";
  } else if (avg < 15) {
    return "#FF0000";
  } else if (avg < 20) {
    return "#00FF00";
  } else {
    return "#0000FF";
  }
}
