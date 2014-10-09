/**
 * Node uses "require" to load a module. The return value is assigned to a
 * variable which we then use to access that module's APIs
 *
 * Just FYI: `module.exports` is a way to "export" functions, values, and
 * variables from this "module" which is currently index.js. If I want another
 * file to be able to access this:
 *
 * FILE: user.js
 * 
 * var jess = "Hi I'm Jess";
 *
 * Then I should do
 * module.exports.jess = jess;
 *
 * This will allow another file to write the line:
 *
 * FILE: otherfile.js
 * 
 * var otherStuff = require('user.js');
 *
 * And then I can do this:
 * var cool = otherStuff.jess; // cool's value will be "Hi I'm Jess"
 *
 * You can do something like this too instead:
 *
 * FILE: user.js
 * 
 * module.exports = function(name) { 
 *     this.greet = function() {
 *         console.log("Hi, my name is " + name);
 *     };    
 * };
 *
 * And then you can do this:
 *
 * FILE: otherfile.js
 * 
 * var Person = require('user.js');
 *
 * var jess = new Person('jess');
 * jess.greet(); // logs "Hi, my name is jess"
 */
var app = require('express')();

/**
 * `http` is a module that comes with node. Server is a class that emits events
 * but not sure what it's doing with the express app argument. Why aren't we
 * using `.createServer`?
 *
 * Just got on IRC and Aria said that createServer is the right way to do it.
 */
var http = require('http').createServer(app);
var path = require('path');

/**
 * Loading the `socket.io` module and passing in our node server
 */
var io = require('socket.io')(http);

app.get('/jess', function(req, res) {

    /**
     * When the '/' path is requested, the application will do the following.
     *
     * res.send( String ); will send HTML to the requestor
     * res.sendFile( String ) will send a file over
     */
    res.sendFile('index.html', { root: path.join(__dirname)});
});

/**
 * Socket.io is listening for the "connection" event for incoming sockets and
 * then logging
 */
io.on('connection', function(socket) {
    console.log('a user connected');
    // console.log("socket: ");
    // console.log(socket);
    
    /**
     * And when sockets disconnect, we can listen for that too.
     */
    socket.on('disconnect', function() {
        console.log('user disconnected');
    });

    /**
     * The "chat message" event is emitted from the client, which is listened
     * for here and a callback is fired.
     */
    socket.on('chat message', function(data) {
        console.log(data);
        io.emit('chat message', data);
    });

});

http.listen(3000, function() {
    console.log('listening on port *:3000');
});