var express = require('express');
var app = express();
var path = require('path');
var bodyParser = require('body-parser');
var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var url = 'mongodb://localhost:27017/ardumed';



app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));

app.use('/bower_components', express.static(__dirname + '/bower_components'));
app.use(express.static(__dirname + '/src/assets'));
app.use(express.static(__dirname + '/src/include'));
app.use(express.static(__dirname + '/src/dashboard'));
app.use(express.static(__dirname + '/src/simulation'));
//app.use(express.static(__dirname + '/src/login'));

//app.get('/login', function (req, res) {
//  res.sendFile(path.join(__dirname + '/src/login/login.html'));
//});


app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname + '/src/dashboard/DashboardForm.html'));
});


app.post('/setprescription', function (req, res) {
  getDetails(req);
  res.sendFile(path.join(__dirname + '/src/simulation/simget.html'));
});

app.get('/simulation', function(req, res){
  res.sendFile(path.join(__dirname + '/src/simulation/simget.html'));
});

app.post('/simulation', function(req, res){
  var reply = {};
  // reply.date = req.body.date;
  // reply.time = req.body.time;
  simulationSave(req);
  res.sendFile(path.join(__dirname + '/src/simulation/simget.html'));
});

var getDetails = function(req){
  var det = {};
  det.name = req.body.patientName;
  det.age = req.body.patientAge;
  det.medNum = req.body.medicineNumber;

  var fromDate = new Date(req.body.fromDate);
  fromDate.setHours(0,0,0,0);
  det.from = fromDate;

  var toDate = new Date(req.body.toDate);
  toDate.setHours(24,0,0,0);
  det.to = toDate;

  det.med0 = req.body.medicineName1;
  det.med0morning = req.body.morningCheckbox1;
  det.med0noon = req.body.noonCheckbox1;
  det.med0night = req.body.nightCheckbox1;
  det.med0syrup = req.body.check1;

  det.med1 = req.body.medicineName2;
  det.med1morning = req.body.morningCheckbox2;
  det.med1noon = req.body.noonCheckbox2;
  det.med1night = req.body.nightCheckbox2;
  det.med1syrup = req.body.check2;

  det.med2 = req.body.medicineName3;
  det.med2morning = req.body.morningCheckbox3;
  det.med2noon = req.body.noonCheckbox3;
  det.med2night = req.body.nightCheckbox3;
  det.med2syrup = req.body.check3;

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


var simulationSave = function(req){
  var det = {};
  var x = new Date(req.body.date+' '+req.body.time);
  det.datetime = x;

  var insertDocument = function(db, callback) {
     db.collection('simulation').insertOne(det, function(err, result) {
      assert.equal(err, null);
      console.log(det);
      console.log("Inserted a document into the user collection.");
      callback();
    });
  };

  return MongoClient.connect(url, function(err, db) {
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


 var port = process.env.PORT || 3000;
 app.listen(port, function() {
  console.log('Example app listening on port '+ port +' !');
});
