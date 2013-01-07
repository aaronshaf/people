var Relationships = require("../models/relationships");
var _ = require("underscore");
var Q = require("q");

RelationshipsController = _.bindAll({
	initialize: function(app) {
		app.get('/relationships/:id', this.read);
	},

	read: function(req, res) {
		res.json({
			error: 'Not implemented yet.'
		});
	}
});

module.exports = RelationshipsController;