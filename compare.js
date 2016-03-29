var mongojs = require('mongojs');
var url = 'mongodb://localhost:27017/ardumed';
var db = mongojs(url,['user', 'simulation']);
var five = require("johnny-five");
var board = new five.Board({baudrate: 9600});

var dbPromise1 = new Promise(function(resolve, reject) {
  db.simulation.find().sort({$natural:-1}).limit(1, (function(err, docs) {
    if(err){
      return reject(err);
    }
    resolve(docs);
  }));
});

var dbPromise2 = new Promise(function(resolve, reject) {
  db.user.find().sort({$natural:-1}).limit(1, (function(err, docs) {
    if(err){
      return reject(err);
    }
    resolve(docs);
  }));
});

var continuousDataNotifier = function(dbPromise1, dbPromise2, db){
  return Promise.all([dbPromise1, dbPromise2])
  .then(function(result1){
    console.log(result1);
    // console.log(result2);
    var simulation = result1[0][0];
    var userObject = result1[1][0];
    var simulationTime = new Date(simulation.datetime);
    var fromdate = result1[1][0].from;
    var todate = result1[1][0].to;
    // morning
    var dateInRange = (fromdate <= simulationTime && simulationTime <= todate);
    // console.log(dateInRange);
    var simulationHour = simulationTime.getHours();
    var isMorning = (simulationHour > 8 && simulationHour <10  );
    var isNoon = (simulationHour > 13 && simulationHour <14  );
    var isNight = (simulationHour > 20 && simulationHour <22  );

    if (dateInRange){
      console.log(isMorning);
      if(isMorning){
        if(userObject.med0morning)
          console.log("med0morning");
        else
          console.log("else morning");

        if(userObject.med1morning)
          console.log("med1morning");
        else
          console.log("else morning");

        if(userObject.med2morning)
          console.log("med2morning");
        else
          console.log("else morning");
      }
    }
    db.close();
  },console.log);
};
/**
 *
 *THIS IS THE BOARD CONTROLLER -  WHEN THIS RUNS, THE BOARD IS SWITHCED ON
 *AFTER THAT IT RUNS THE ABOVE FUNCTIONS TO GET LATEST RECORDS OF THE BOTH
 *USER AND SIMULATION
 *
 * DEPENDING UPON SIMULATION CHANGES, THE LED BLINKS WILL CHANGE
 *
 */
board.on("ready", function() {
  new five.Pin({
  pin: 'A0',
  type: "digital"
  });

  new five.Pin({
  pin: 'A1',
  type: "digital"
  });

  new five.Pin({
  pin: 'A2',
  type: "digital"
  });
  continuousDataNotifier(dbPromise1, dbPromise2, db);
});
