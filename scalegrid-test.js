var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');

var url = 'mongodb://admin:nON6zS3uWa99wtGS@SG-ardumed-7417.servers.mongodirector.com:27017/admin';
MongoClient.connect(url, function(err, db) {
    assert.equal(null, err);
    findRestaurants(db, function() {
        db.close();
    });
});


var insertDocument = function(db, callback) {
    db.collection('appliance').insertOne({
        "lights": 1,
        "fan": 1,
        "tv": 1,
        "user": 1
    }, function(err, result) {
        assert.equal(err, null);
        console.log("Inserted a document into the appliance collection");
        callback();
    });
};

var findRestaurants = function(db, callback) {
    var cursor = db.collection('appliance').find();
    cursor.each(function(err, doc) {
        assert.equal(err, null);
        if (doc != null) {
            console.dir(doc);
        } else {
            callback();
        }
    });
};
