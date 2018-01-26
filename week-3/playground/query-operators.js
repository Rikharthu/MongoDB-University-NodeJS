var MongoClient = require('mongodb').MongoClient,
    commandLineArgs = require('command-line-args'),
    assert = require('assert');


var options = commandLineOptions();

MongoClient.connect('mongodb://localhost:27017', function (err, client) {

    assert.equal(err, null);
    console.log("Successfully connected to MongoDB.");

    const db = client.db('crunchbase'); // database name

    var query = queryDocument(options);
    // In shell it would look like that:
    // db.getCollection('companies').find({"founded_year":{"$gte":1996,"$lte":2017}}, { "_id": 1, "name": 1, "founded_year": 1, "number_of_employees": 1, "crunchbase_url": 1 })

    var projection = {
        "_id": 1, "name": 1, "founded_year": 1,
        "number_of_employees": 1, "crunchbase_url": 1
    };

    if ("ipo" in options && options.ipo == "yes") {
        projection["ipo.valuation_amount"] = 1;
    }

    if ("country" in options) {
        projection["offices.description"] = 1;
        projection["offices.address1"] = 1;
        projection["offices.address2"] = 1;
        projection["offices.country_code"] = 1;
    }

    var cursor = db.collection('companies').find(query, { fields: projection });
    var numMatches = 0;

    // Sourt by founded_year
    // cursor.sort({founded_year:1}); // 1 - ASC, -1 - DESC
    // sort on multiple fields (element order matters)
    cursor.sort([["founded_year", 1], ["number_of_employees", -1]]);
    // Skip first n records
    cursor.skip(options.skip);
    cursor.limit(options.limit);

    cursor.forEach(
        function (doc) {
            numMatches = numMatches + 1;
            console.log(doc);
        },
        function (err) {
            assert.equal(err, null);
            console.log("Our query was:" + JSON.stringify(query));
            console.log("Matching documents: " + numMatches);
            return client.close();
        }
    );

});


function queryDocument(options) {

    console.log(options);

    // More info: https://docs.mongodb.com/manual/reference/operator/query/#query-selectors
    var query = {
        "founded_year": {
            "$gte": options.firstYear,
            "$lte": options.lastYear
        }
    };

    if ("employees" in options) {
        query.number_of_employees = { "$gte": options.employees };
    }

    if ("ipo" in options) {
        if (options.ipo == "yes") {
            // ipo.valuation_amount exists and not null
            query["ipo.valuation_amount"] = { "$exists": true, "$ne": null };
        } else if (options.ipo == "no") {
            query["ipo.valuation_amount"] = null;
        }
    }

    if ("country" in options) {
        query["offices.country_code"] = options.country;
    }

    return query;

}


function commandLineOptions() {

    var cli = commandLineArgs([
        { name: "firstYear", alias: "f", type: Number },
        { name: "lastYear", alias: "l", type: Number },
        { name: "employees", alias: "e", type: Number },
        { name: "ipo", alias: "i", type: String },
        { name: "country", alias: "c", type: String },
        { name: "skip", type: Number, defaultValue: 0 },
        { name: "limit", type: Number, defaultValue: 20000 }
    ]);

    var options = cli.parse()
    if (!(("firstYear" in options) && ("lastYear" in options))) {
        console.log(cli.getUsage({
            title: "Usage",
            description: "The first two options below are required. The rest are optional."
        }));
        process.exit();
    }

    return options;

}


