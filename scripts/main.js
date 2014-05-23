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

var mapManager;
$(window).load(function() {
  mapManager = new MapManager(400, 400);
  $('#mapAndCanvasContainer').append(mapManager.getMap());
  console.log("added");
});

function addEfficiency() {
  $("#mapAndCanvasContainer").activity();
  mapManager.showEfficiency({
    efficiency: 10,
    timestamp: "Thu May 22 2014 16:23:54 GMT-0700 (PDT)",
    location: { lat: 47.654109, long: -122.304331 } }, function() {
    console.log("done");
  }, function() {
    $("#mapAndCanvasContainer").activity(false);
  });
}

/*
function addEfficiencyDataToMap(data) {

  clearMap();
  attachOptions(data);
  var circle;
  var duplicate = 2;
  for (var i = 0; i < duplicate; i++) {

    _.each(data, function(point) {
    //  Add the circle for this city to the map.
      circle = new google.maps.Circle(point.options);
      circle.setMap(map);
      currentPoints.push(circle);
    });
  }
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
      strokeOpacity: .2,
      strokeWeight: .1,
      fillColor: color,
      fillOpacity: 0.2,
      map: map,
      center: new google.maps.LatLng(point.location.lat, point.location.long),
      radius: 50
    }
  });
}
*/

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
