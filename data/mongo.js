var Q = require("q");
var ObjectID = require('mongodb').ObjectID;
var MongoClient = require('mongodb').MongoClient;
exports.mongo = {};
var connection;

if(!process.env.MONGO_URL) {
	process.env.MONGO_URL= 'mongodb://admin@localhost';
}

//MongoDB
MongoClient.connect(process.env.MONGO_URL, {
	'journal': true,
	'fsync': true,
	'numberOfRetries': 100
}, function(err, db) {
	connection = db;
	console.log('Mongo loaded.');
	db.addListener('error', function(err) {
		console.log('There was an error connecting to MongoDB.');
	});
});

exports.collection = function(collection) {
	var deferred = Q.defer();
	
	connection.collection(collection,function(error, collection) {
		if(error) {
			deferred.reject(error);
		} else {
			deferred.resolve(collection);
		}
	});

	return deferred.promise;
};

exports.query = function(query) {
	if(typeof query === "string") {
		query = {_id: ObjectID(query)};
	} else if(query instanceof Array) {
		var conditions = [];
		query.forEach(function(id) {
			conditions.push({_id: ObjectID(id)});
		});
		query = {
			$or: conditions
		};
	} else if(typeof query._id === "string") {
		query._id = ObjectID(query);
	}
	return query;
};
