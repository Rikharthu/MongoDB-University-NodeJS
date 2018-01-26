var MongoClient = require('mongodb').MongoClient,
    assert = require('assert');

MongoClient.connect('mongodb://localhost:27017', function (err, client) {

    assert.equal(err, null);
    console.log("Successfully connected to MongoDB.");

    const db = client.db('crunchbase'); // database name

    var query = {
        "category_code": "biotech"
    };

    var cursor = db
        .collection('companies')
        .find(query);
    // mongodb creates the cursor initially, and streams data to it when needed

    /* iterate over cursor (stream the data from the database instead loading it all at once) */
    cursor.forEach((doc) => {
        console.log(`${doc.name} is a ${doc.category_code} company`);
    }, (err) => {
        // this is called when cursor is exhausted or an error occured
        assert.equal(err, null);
        return client.close();
    });


    // db.collection('companies')
    //     .find(query)
    //     .toArray(function (err, docs) { // consume the cursor and create array from it
    //         // we could also use.find({category_code: 'biotech'})assert.equal(err, null);
    //         assert.notEqual(docs.length, 0);
    //         docs.forEach(function (doc) {
    //             console.log(doc.name + " is a " + doc.category_code + " company.");
    //         });
    //         db.close();
    //         client.close();
    //     });

});
