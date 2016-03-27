var express = require('express');
var app = express();
var path = require('path');

app.use(express.static(__dirname + '/bower_components'));


app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname + '/app/html/index.html'));
});


app.get('/today', function (req, res) {
  res.sendFile(path.join(__dirname + '/app/html/today.html'));
});


app.post('/setprescription', function (req, res) {
  res.sendFile(path.join(__dirname + '/app/html/setprescription.html'));
});
/**
 * - POST : set prescription
 * - GET: mainpage : introduction page
 * - GET: day : prescription for that day
 */



app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});
