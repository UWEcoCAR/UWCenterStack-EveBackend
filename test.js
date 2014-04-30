var emitter = require('./TestCanEmitter');
new require('./EveBackend').CanLogger(new emitter());