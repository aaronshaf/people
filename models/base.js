var nodecache = require("../data/nodecache");
var mongo = require("../data/mongo");
var ObjectID = require("mongodb").ObjectID;
var Q = require("q");
var _ = require("underscore");

var Base = {
  findOne: function(query) {
    if(typeof query === 'undefined') query = {};

    var defer = Q.defer();

    if(!this.collection) {
      defer.reject('Collection name not set.');
      return defer.promise;
    }

    var collectionName = this.collection;
    query = mongo.query(query);

    nodecache.get(this.collection, query).then(function(value) {
      if (defer.promise.isResolved()) {
        return;
      }
      if (value) {
        //console.log('nodecache wins ' + collectionName);
        return defer.resolve(value);
      }
    });

    mongo.collection(this.collection).then(function(collection) {
      return collection.findOne(query, function(error, result) {
        if (error) {
          return defer.reject(error);
        } else {
          if (result) {
            nodecache.set(collection.collectionName, query, result);
          }
          if (!defer.promise.isResolved()) {
            //console.log('mongo wins ' + collectionName);
            return defer.resolve(result);
          }
        }
      });
    });

    return defer.promise;
  },

  remove: function(query) {
    var defer = Q.defer();

    if(!this.collection) {
      defer.reject('Collection name not set.');
      return defer.promise;
    }

    if(typeof query._id === 'string') {
      query._id = ObjectID(query._id);
    }

    mongo.collection(this.collection).then(function(collection) {
      return collection.remove(query, function(error, result) {
        if (error) {
          return defer.reject(error);
        } else {
          return defer.resolve(result);
        }
      });
    });

    return defer.promise;
  },

  find: function(query, options) {
    var defer = Q.defer();
    if(!this.collection) {
      defer.reject('Collection name not set.');
      return defer.promise;
    }
    query = query || {};
    query = mongo.query(query);

    options = options || {};
    options = _.defaults(options, {
      limit: 30,
      skip: 0,
      sort: {modified: -1},
      fields: {}
    });

    mongo.collection(this.collection).then(function(collection) {
      return collection.find(query, options.fields).limit(options.limit).skip(options.skip).sort(options.sort).toArray(function(error, result) {
        if (error) {
          return defer.reject(error);
        } else if (!defer.promise.isResolved()) {
          return defer.resolve(result);
        }
      });
    });
    return defer.promise;
  },

  save: function(data) {
    var defer = Q.defer();
    var _id;

    //data = this.prepare(data);

    if (data._id) {
      _id = ObjectID(data._id);
      delete data._id;
    } else {
      _id = ObjectID();
    }

    mongo.collection(this.collection).then(function(collection) {
      return collection.findAndModify({
        _id: _id
      }, {}, {
        $set: data
      }, {
        upsert: true,
        "new": true
      }, function(error, object) {
        if (error) {
          return defer.reject(error);
        } else {
          return defer.resolve(object);
        }
      });
    });

    return defer.promise;
  }
};

module.exports = Base;