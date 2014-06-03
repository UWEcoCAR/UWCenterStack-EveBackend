var mapManager;
$(window).load(function() {
  mapManager = new MapManager({
    LAT: 47.654109,
    LNG: -122.304331,
    HEIGHT: 300,
    WIDTH: 700
  });
  $('#mapAndCanvasContainer').append(mapManager.getMap());
  console.log("added");
});

function addEfficiency() {
  mapManager.showEfficiency({
    efficiency: 10,
    timestamp: "Thu May 22 2014 16:23:54 GMT-0700 (PDT)",
    location: { lat: 47.654109, long: -122.304331 } }, function() {
    console.log("done");
  }, function() {
  });
}

function clearMap() {
  mapManager.clearMap();
}
