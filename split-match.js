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
var fs = require('fs'),
    program = require('commander'),
    PatternMatch = require('./PatternMatch');

//Program module is for taking command line arguments
program
    .version('0.0.1')
    .option('-p --pattern <pattern>', 'Input Pattern', /^(.|,)$/i)
    .parse(process.argv);
    
if (!program.pattern) {
    console.log("Usage: node split-match.js -p <pattern>");
    return;
}
// Create an input stream from the file system.
var inputStream = fs.createReadStream( "input-sensor.txt" );
console.log("--------------------Input--------------------");
inputStream.pipe(process.stdout);
// Create a Regular Expression stream that will run through the input and find matches
// for the given pattern - "words".
var patternStream = inputStream.pipe( new PatternMatch(program.pattern));
// Read matches from the stream.
var patternMatches = [];
patternStream.on('readable', function () {
    var words
    while (null !== (words = patternStream.read())) {
        patternMatches.push(words);
    }
});

patternStream.on('end', function () {
    console.log("\n--------------------Output--------------------");
    console.log(patternMatches);
})