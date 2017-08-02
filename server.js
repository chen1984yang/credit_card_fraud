//server.js
'use strict'

//first we import our dependencies...
var express = require('express');
//var mongoose = require('mongoose');
var bodyParser = require('body-parser');
//var Comment = require('./model/comments');
var neo4j = require('neo4j-driver').v1;
//and create our instances
var app = express();
var router = express.Router();

//set our port to either a predetermined port number if you have set it up, or 3001
var port = process.env.API_PORT || 3001;

//db config -- REPLACE USERNAME/PASSWORD WITH YOUR OWN FROM MLAB!
//mongoose.connect('mongodb://<DBUSERNAME>:<DBPASSWORD>@ds019836.mlab.com:19836/bryandb');
var driver = neo4j.driver('bolt://localhost',neo4j.auth.basic('neo4j','1984813'));
var session = driver.session();

//now we should configure the APi to use bodyParser and look for JSON data in the body
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//To prevent errors from Cross Origin Resource Sharing, we will set our headers to allow CORS with middleware like so:
app.use(function(req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Methods', 'GET,HEAD,OPTIONS,POST,PUT,DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers');

  //and remove cacheing so we get the most recent comments
  res.setHeader('Cache-Control', 'no-cache');
  next();
});

//now  we can set the route path & initialize the API
router.get('/', function(req, res) {
  res.json({ message: 'API Initialized!'});

});
  var suspectTran_query = [
    'MATCH (victim:person)‐[r:HAS_BOUGHT_AT]‐>(merchant)',
    'WHERE r.status = "Disputed"',
    'MATCH (victim)‐[t:HAS_BOUGHT_AT]‐>(othermerchants)',
    'WHERE t.status = "Undisputed" AND t.time < r.time',
    'WITH victim, othermerchants, t ORDER BY t.time DESC',
    'RETURN victim.name as customer_name, othermerchants.name as store_name, t.amount as amount, t.time as transaction_time ORDER BY transaction_time DESC'
  ].join('\n');

  var fraudTran_query = [
     'MATCH (victim:person)‐[r:HAS_BOUGHT_AT]‐>(merchant)',
     'WHERE r.status = "Disputed"',
     'RETURN victim.name as customer_name, merchant.name as store_name, r.amount as amount, r.time as transaction_time',
     'ORDER BY transaction_time DESC'
  ].join('\n');

  var commonTran_query = [
  'MATCH (victim:person)‐[r:HAS_BOUGHT_AT]‐>(merchant)',
  'WHERE r.status = "Disputed"',
  'MATCH (victim)‐[t:HAS_BOUGHT_AT]‐>(othermerchants)',
  'WHERE t.status = "Undisputed" AND t.time < r.time',
  'WITH victim, othermerchants, t ORDER BY t.time DESC',
  'RETURN DISTINCT othermerchants.name as suspicious_store, count(DISTINCT t) as count, collect(DISTINCT victim.name) as victims',
  'ORDER BY count DESC'
  ].join('\n');

//adding the /comments route to our /api router
router.route('/comments')
  //retrieve all comments from the database
  .get(function(req, res) {
    //looks at our Comment Schema
    var suspectArr = [];
    var fraudArr = [];
    var commonArr = [];
    //suspectQuery
    session.run(suspectTran_query)
      .then(function(result){    
        result.records.forEach(function(record){
          suspectArr.push(record);
        });
          //fraud query
          session.run(fraudTran_query)
          .then(function(result){
                result.records.forEach(function(record){
                    fraudArr.push(record);
                });

              //common query
                  session.run(commonTran_query)
                  .then(function(result){
                      result.records.forEach(function(record){
                          commonArr.push(record);
                      });
                      res.json({
                        suspectTranArray:suspectArr,
                        fraudTranArray:fraudArr,
                        commonTranArray:commonArr
                      });

                  })
                  .catch(function(err){
                    consold.log(err);
                  });

          })
          .catch(function(err){
            consold.log(err);
          });
        
    })
    .catch(function(err){
      consold.log(err);
    });
      /*  
    Comment.find(function(err, comments) {
      if (err)
        res.send(err);
      //responds with a json object of our database comments.
      res.json(comments)
    });*/
  })
  //post new comment to the database
  .post(function(req, res) {
    var comment = new Comment();
    (req.body.author) ? comment.author = req.body.author : null;
    (req.body.text) ? comment.text = req.body.text : null;

    comment.save(function(err) {
      if (err)
        res.send(err);
      res.json({ message: 'Comment successfully added!' });
    });
  });

//Adding a route to a specific comment based on the database ID
router.route('/comments/:comment_id')
//The put method gives us the chance to update our comment based on the ID passed to the route
  .put(function(req, res) {
    Comment.findById(req.params.comment_id, function(err, comment) {
      if (err)
        res.send(err);
      //setting the new author and text to whatever was changed. If nothing was changed
      // we will not alter the field.
      (req.body.author) ? comment.author = req.body.author : null;
      (req.body.text) ? comment.text = req.body.text : null;
      //save comment
      comment.save(function(err) {
        if (err)
          res.send(err);
        res.json({ message: 'Comment has been updated' });
      });
    });
  })
  //delete method for removing a comment from our database
  .delete(function(req, res) {
    //selects the comment by its ID, then removes it.
    Comment.remove({ _id: req.params.comment_id }, function(err, comment) {
      if (err)
        res.send(err);
      res.json({ message: 'Comment has been deleted' })
    })
  });

//Use our router configuration when we call /api
app.use('/api', router);

//starts the server and listens for requests
app.listen(port, function() {
  console.log(`api running on port ${port}`);
});
