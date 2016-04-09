/*
A simple node.js that uses streams to transform the data and it teaches command line
application development.
References:
+ https://strongloop.com/strongblog/practical-examples-of-the-new-node-js-streams-api/
+ For prototyping and inheritence model
refer to intermediate.js on canvas and http://book.mixu.net/node/ch6.html
+ https://nodesource.com/blog/understanding-object-streams/
+ commander.js
- https://github.com/visionmedia/commander.js
- http://tjholowaychuk.com/post/9103188408/commander-js-nodejs-command-lineinterfaces-
made-easy
*/
var Transform = require('stream').Transform,
    inherits = require( "util" ).inherits;
//other modules such as fs, commander, underscore etc are loaded
// For Node 0.8 users
if (!Transform) {
Transform = require('readable-stream/transform');
}
//Constructor logic includes Internal state PatternMatch needs to consider because it has to parse chunks that get transformed
function PatternMatch(pattern) {
    this.pattern = pattern;
//Switching on object mode so when stream reads sensordata it emits single pattern match.
    Transform.call(this, {objectMode: true});
}

// Extend the Transform class.
// --
// NOTE: This only extends the class methods - not the internal properties. As such we
// have to make sure to call the Transform constructor(above).
inherits(PatternMatch, Transform);
// Transform classes require that we implement a single method called _transform and
//optionally implement a method called _flush. You assignment will implement both.
PatternMatch.prototype._transform = function (chunk, encoding, getNextChunk){
    var data = chunk.toString();
    
    if (this._lastLineData) {
        data = this._lastLineData + data;
    }

    var lines = data.split(this.pattern);

    this._lastLineData = lines.splice(lines.length - 1, 1)[0];

    lines.forEach(this.push.bind(this));

    getNextChunk();
};
//After stream has been read and transformed, the _flush method is called. It is a great
//place to push values to output stream and clean up existing data
PatternMatch.prototype._flush = function (flushCompleted) {
    // if (this._lastLineData) {
    //     this.push(this._lastLineData);
    // }

    // this._lastLineData = null;
    flushCompleted();
};

module.exports = PatternMatch;
//That wraps up our little patternMatch module.
