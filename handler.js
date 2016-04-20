'use strict';
var
pk = 0,
collection = "urls";

module.exports = {

  handleUrl : function (newurl, res, db) {
    pk++;
    var newDoc = {
      "id" : pk,
      "original_url" : newurl,
      "short_url" : "https://freecodecamp-proj-emoracle.c9users.io/shortener/" + pk,
    },
    col = db.collection(collection);

/* 
* Insert the url if it doesn't exists
*/
    col.updateOne({
      origin_url : newurl
    }, newDoc, {
      upsert : true,
      w : 1
    }, function (err, result) {
      if (err)
        throw err;
      // Fetch the insert 
      db.collection('urls').find({
        "original_url" : newurl
      }).limit(1).toArray(function (err, doc) {
        if (err)
          throw err;
        if (doc.length === 0) {
          res.json({
            "error" : "url not found"
          });
        } else {
          res.send(JSON.stringify({original_url : doc[0].original_url, short_url : doc[0].short_url}));
        }
      });

    });
  },

  handleId : function (id, res, db) {
    // get the id of the url and redirect to it
    db.collection('urls').find({
      "id" : id
    }).limit(1).toArray(function (err, doc) {
      if (err)
        throw err;
      if (doc.length === 0) {
        res.json({
          "error" : "Id not found"
        });
      } else {
        res.redirect(doc[0].original_url);
      }
    });
  }
};
