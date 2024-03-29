var express = require('express'),
	http = require('http'),
	path = require('path');

var app = express();

app.configure(function(){
	app.set('port', process.env.PORT || 3000);
	//app.set('views', __dirname + '/views');
	//app.use(express.favicon());
	app.use(express.logger('dev'));
	app.use(express.bodyParser());
	app.use(express.methodOverride());
	app.use(express.static(path.join(__dirname, 'public')));
	app.use(app.router);
});

var RelationshipsController = require('./controllers/relationships');
RelationshipsController.initialize(app);

app.configure('development', function(){
	app.use(express.errorHandler());
});

var server = http.createServer(app);
server.listen(app.get('port'), function(){
	console.log("Express server listening on port " + app.get('port'));
});