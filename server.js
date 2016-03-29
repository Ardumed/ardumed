var express = require('express');
var app = express();
var path = require('path');
var bodyParser = require('body-parser');
var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var url = 'mongodb://localhost:27017/test';



app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));

app.use('/bower_components', express.static(__dirname + '/bower_components'));
app.use(express.static(__dirname + '/src/assets'));
app.use(express.static(__dirname + '/src/include'));
app.use(express.static(__dirname + '/src/dashboard'));
app.use(express.static(__dirname + '/src/login'));

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname + '/src/login/login.html'));
});


app.get('/dashboard', function (req, res) {
  res.sendFile(path.join(__dirname + '/src/dashboard/DashboardForm.html'));
});


app.post('/setprescription', function (req, res) {
  getDetails(req);
  res.sendFile(path.join(__dirname + '/app/html/setprescription.html'));
});

var getDetails = function(req){
  var det = {};
  det.name = req.body.patientName;
  det.age = req.body.patientAge;
  det.medNum = req.body.medicineNumber;
  var current = new Date();
  det.from = current;
  current.setDate(current.getDay()+30);
  det.to = current;
  det.med0 = req.body.medicineName1;
  det.med0morning = req.body.morningCheckbox1;
  det.med0noon = req.body.noonCheckbox1;
  det.med0night = req.body.nightCheckbox1;
  // det.med1 = req.body.medicineName2;
  // det.med1.morning = req.body.morningCheckbox2;
  // det.med1.noon = req.body.noonCheckbox2;
  // det.med1.night = req.body.nightCheckbox2;
  // det.med2 = req.body.medicineName2;
  // det.med2.morning = req.body.morningCheckbox3;
  // det.med2.noon = req.body.noonCheckbox3;
  // det.med2.night = req.body.nightCheckbox3;

  var insertDocument = function(db, callback) {
     db.collection('user').insertOne(det, function(err, result) {
      assert.equal(err, null);
      console.log(det);
      console.log("Inserted a document into the restaurants collection.");
      callback();
    });
  };

  MongoClient.connect(url, function(err, db) {
    assert.equal(null, err);
    insertDocument(db, function() {
        db.close();
    });
  });

};

/**
 * - POST : set prescription
 * - GET: mainpage : introduction page
 * - GET: day : prescription for that day
 */



app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});
