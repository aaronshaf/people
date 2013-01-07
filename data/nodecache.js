var _ = require("underscore");
var Q = require("q");
var phpjs = require("phpjs");

var cache = [];

exports.set = function(collection, key, value) {
	var defer = Q.defer();

	if(typeof key !== "string") {
		key = JSON.stringify(key);
	}

	key = collection + ":" + phpjs.md5(key);

	cache[key] = value;

	var keys = _.keys(cache);
	if(keys.length > 1000) {
		delete cache[keys[Math.floor(Math.random() * keys.length)]];
	}

	defer.resolve();
	
	return defer.promise;
};

exports.get = function(collection, key) {
	var defer = Q.defer();

	var approved = [
		'people'
	];

	if(_.indexOf(approved,collection) === -1) {
		defer.reject();
	} else {
		if(typeof key !== "string") {
			key = JSON.stringify(key);
		}

		key = collection + ":" + phpjs.md5(key);

		if(typeof cache[key] != 'undefined') {
			defer.resolve(cache[key]);
		} else {
			defer.reject();
		}
	}

	return defer.promise;
};