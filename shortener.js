'use strict';

var
MONGOLAB_URI = process.env.MONGOLAB_URI||"mongodb://localhost:27017/clementinejs",
express = require("express"),
app = express(),
handler = require("./handler.js"),
mongo = require('mongodb').MongoClient,
port = process.env.PORT || 8080;

console.log("Database: " + MONGOLAB_URI);
mongo.connect(MONGOLAB_URI, function (err, db) {
  if (err) throw err;

  app.get('/shortener/', function (req, res) {
    res.sendFile(require("path").join(__dirname + '/index.html'));
  });

  app.get('/shortener/:id', function (req, res) {
    handler.handleId(Number(req.params.id), res, db);
  });

  app.route(/shortener\/new\/.+/).get(function (req, res) {
    handler.handleUrl(req.url.substr(req.url.indexOf('/', 14) + 1, req.url.length), res, db);
  });

  app.listen(port, function () {
    console.log('Listening on port ' + port + '...');
  });
});