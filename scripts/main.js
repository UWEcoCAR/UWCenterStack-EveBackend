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
