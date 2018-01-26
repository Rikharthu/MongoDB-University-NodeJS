var MongoClient = require('mongodb').MongoClient,
    assert = require('assert');

MongoClient.connect('mongodb://localhost:27017', function (err, client) {

    assert.equal(err, null);
    console.log("Successfully connected to MongoDB.");

    const db = client.db('crunchbase'); // database name

    var query = {
        "category_code": "biotech"
    };

    // Projection
    // select only needed fields: name and category_code, do not select _id (included by default)
    var projection = { "name": 1, "category_code": 1, "_id": 0 };
    // works similarly, like in shell:
    // db.moviesScratch.find({year:2009}, {title:1,_id:0})

    var cursor = db
        .collection('companies')
        .find(query);

    // Apply projection to the cursor
    cursor.project(projection);
    // Or pass projection directly to find() method: .find(query, { fields: projection });

    cursor.forEach((doc) => {
        console.log(doc);
    }, (err) => {
        assert.equal(err, null);
        return client.close();
    });

});
