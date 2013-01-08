var Relationships = require("../models/relationships");
var _ = require("underscore");
var Q = require("q");

RelationshipsController = _.bindAll({
	initialize: function(app) {
		console.log('RelationshipsController loaded');
		app.get('/relationships', this.read);
		app.get('/relationships/:_id', this.readOne);
		app.post('/relationships', this.create);
		app.post('/relationships/:_id', this.save);
		app.delete('/relationships/:_id', this.delete);
	},

	delete: function(req, res) {
		console.log('Trying to delete ' + req.params._id);
		Relationships.remove(req.params._id).then(function() {
			res.json({success:"Relationship was deleted."});
		}).fail(function() {
			res.json(500,{error: "Could not delete relationship."});
		});
	},

	create: function(req, res) {
		Relationships.save(req.body).then(function (data) {
			res.json(201,data);
		}).fail(function() {
			res.json(500,{error: "Could not create"});
		});
	},

	save: function(req, res) {
		Relationships.save(req.body).then(function (data) {
			res.json(200,data);
		}).fail(function() {
			res.json(500,{error: "Could not create"});
		});
	},

	read: function(req, res) {
		Relationships.find({}).then(function (data) {
			res.json(data);
		}).fail(function() {
			res.json(500,{error: "Could not read"});
		});
	},

	readOne: function(req, res) {
		Relationships.findOne(req.params._id).then(function (data) {
			res.json(data);
		}).fail(function() {
			res.json(500,{error: "Could not read"});
		});
	}
});

module.exports = RelationshipsController;