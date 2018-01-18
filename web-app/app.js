var express = require('express'),
    app = express(),
    engines = require('consolidate'),
    MongoClient = require('mongodb').MongoClient,
    assert = require('assert');

app.engine('html', engines.nunjucks);
app.set('view engine', 'html');
app.set('views', __dirname + '/views');

function errorHandler(err, req, res, next) {
    console.error(err.message);
    console.error(err.stack);
    res.status(500);
    res.render('error_template', {
        error: err
    });
}

MongoClient.connect('mongodb://localhost:27017', (err, client) => {
    var db = client.db('video');

    assert.equal(null, err);
    console.log('Successfully connected to MongoDB.');

    app.get('/', (req, res) => {
        db.collection('movies').find({}).toArray((err, docs) => {
            res.render('movies', {
                'movies': docs
            });
        });
    });

    // Anything not handled by the application will be handled by this middleware
    app.use(errorHandler);
    app.use((req, res) => {
        res.sendStatus(404);
    });

    var server = app.listen(3000, () => {
        var port = server.address().port;
        console.log(`Listening on port ${port}`);
    });
});