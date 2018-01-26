var MongoClient = require('mongodb').MongoClient,
    assert = require('assert');


MongoClient.connect('mongodb://localhost:27017', function (err, client) {

    assert.equal(err, null);
    console.log("Successfully connected to MongoDB.");

    const db = client.db('crunchbase');

    var query = { "permalink": { "$exists": true, "$ne": null } };
    var projection = { "permalink": 1, "updated_at": 1 };

    // TODO more info:
    // https://docs.mongodb.com/manual/indexes/
    // https://docs.mongodb.com/manual/tutorial/sort-results-with-indexes/
    db.collection('companies').createIndex({permalink:1});
    var cursor = db.collection('companies').find(query);
    cursor.project(projection);
    // cursor.sort({"permalink": 1});

    var numToRemove = 0;

    // Delete duplicates on 'permalink' value
    // Get all companies
    // Project only permalink and _id
    // Sort by permalink
    // Iterate over and check whether current document permalink matches previous one (they are sorted)
    // If it matches - delete

    var previous = { "permalink": "", "updated_at": "" };
    cursor.forEach(
        function (doc) {
            if ((doc.permalink == previous.permalink) && (doc.updated_at == previous.updated_at)) {
                console.log(doc.permalink);

                numToRemove = numToRemove + 1;

                var filter = { "_id": doc._id };

                db.collection('companies').deleteOne(filter, function (err, res) {
                    // { n: 1, ok: 1 }  n - number deleted, ok - success indicator
                    assert.equal(err, null);
                    console.log(res.result);

                });

            }

            previous = doc;

        },
        function (err) {

            assert.equal(err, null);
            console.log('Deleted: ' + numToRemove);
            client.close();
        }
    );

});


