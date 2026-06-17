let express = require('express');
let path = require('path');
let fs = require('fs');
let MongoClient = require('mongodb').MongoClient;
let bodyParser = require('body-parser');
let app = express();

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());

app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, "index.html"));
  });


app.get('/get-profile', function (req, res) {
  var response = res;
  //MongoClient.connect('mongodb://admin:password@localhost:27017', function (err, client) {
  MongoClient.connect(process.env.MONGO_URI, function (err, client) {
    if (err) throw err;

    var db= client.db('user-account');
    var query = { userid: 1 };

    db.collection("users").findOne(query, function (err, result) {
      if (err) throw err;
      response.send(result ? result : {});
      client.close();
    });
 
  });
});

app.post('/update-profile', function (req, res) {
    var userObj=req.body;
    var response = res;
    
    console.log("Db is connecting....")
    //MongoClient.connect('mongodb://admin:password@localhost:27017', function (err, client) {
    MongoClient.connect(process.env.MONGO_URI, function (err, client) {
      if (err) throw err;

      var db= client.db('user-account');
      userObj.userid = 1
      var query = { userid: 1 };
      var newValues = { $set: userObj };

      console.log("updating profile....")

      db.collection("users").updateOne(query, newValues, { upsert: true }, function (err, result) {
        if (err) throw err;
        console.log("profile updated....")
        response.send(result);
        client.close();
      });
    
    });

    //Send Response
    res.send(userObj);
}); 

app.get('/profile-picture', function (req, res) {
    var img = fs.readFileSync(path.join(__dirname, "images/profile-1.jpg"));
    res.writeHead(200, {'Content-Type': 'image/jpeg' });
    res.end(img, 'binary');
});
app.listen(3000, function () {
  console.log("app listening on port 3000!");
});
