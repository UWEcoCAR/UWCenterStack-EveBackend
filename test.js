var http = require('http');
var emitter = require('./TestCanEmitter');
new require('./EveBackend').CanLogger(new emitter(), "Mitch Loeppky");
