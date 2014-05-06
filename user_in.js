var http = require("http");

function ask(question, format, callback) {
 var stdin = process.stdin, stdout = process.stdout;
 
 stdin.resume();
 stdout.write(question + ": ");
 
 stdin.once('data', function(data) {
   data = data.toString().trim();
 
   if (format.test(data)) {
     callback(data);
   } else {
     stdout.write("It should match: "+ format +"\n");
     ask(question, format, callback);
   }
 });
}


ask("fuelConsumption", /.+/, function(fuelConsumption) {
  ask("batteryVoltage", /.+/, function(battVolt) {
    ask("current", /.+/, function(current) {
  	  ask("speed", /.+/, function(speed) {
	    ask("previousSpeed", /.+/, function(prevSpeed) {
          ask("elevation", /.+/, function(elevation) {
	        ask("previousElevation", /.+/, function(previousElevation) {
	          var dieselNrgChange = -fuelConsumption * 9.96 * 1000 * .1 / 3600.0;
	          var electricalNrgChange = battVolt * current * .1 /3600.0;	
	          var kinecticNrgChange = 0.5 * 2025 * (Math.pow(speed * 1000 / 3600.0, 2) - Math.pow(prevSpeed * 1000 / 3600.0, 2)) * 2.78 / 10000;
    	      var potentialNrgChange = 2025 * 9.81 * (elevation - previousElevation) * 2.78 / 10000;
 			  console.log("Diesel Energy Change = " + dieselNrgChange);
 			  console.log("Electrical Energy Change = " + electricalNrgChange);
 			  console.log("Kinectic Energy Change = " + kinecticNrgChange);
 			  console.log("Potential Energy Change = " + potentialNrgChange);
              process.exit();
            });
	      });
        });
  	  });
    });
  });
});
 
http.createServer(function(request, response) {
    response.writeHead(200, {"Content-Type": "text/html"});
    response.end("Hello World!");
}).listen(8080);