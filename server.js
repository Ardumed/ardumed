var express = require('express');
var app = express();
var path = require('path');

app.use('/bower_components', express.static(__dirname + '/bower_components'));
app.use(express.static(__dirname + '/src/dashboard'));
app.use(express.static(__dirname + '/src/assets'));

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname + '/src/login/login.html'));
});


app.get('/dashboard', function (req, res) {
  res.sendFile(path.join(__dirname + '/src/dashboard/DashboardForm.html'));
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
