var medicineNumber = 0, oldMedicineNumber = 0, fromDate, toDate;

var CLIENT_ID = '598206174272-k89f59obn673aaql9u6bjbn59lc19tnd.apps.googleusercontent.com';
var SCOPES = ["https://www.googleapis.com/auth/calendar", "https://www.googleapis.com/auth/userinfo.profile"];
$(function() {
  gapi.auth.authorize({
    'client_id': CLIENT_ID,
    'scope': SCOPES.join(' '),
    'immediate': true
  }, handleAuthResult);
});

function handleAuthResult(authResult) {
  if (!(authResult && !authResult.error))
    window.location="./login.html";
}

$(function() {
  // get current date
  var currDate = new Date();

  // Set up calendar for "Prescription from"
  $('#datetimepicker1').datetimepicker({
    format: 'DD MMM YYYY',
    inline: true,
    minDate: currDate
  });
  fromDate = $('#datetimepicker1').data("DateTimePicker").date();

  // Set up calendar for "Prescription to"
  $('#datetimepicker2').datetimepicker({
    format: 'DD MMM YYYY',
    inline: true,
    minDate: fromDate
  });
  toDate = $('#datetimepicker2').data("DateTimePicker").date();

  // Get parent elements of calendars
  var fromDateParent = $('#datetimepicker1').parent();
  var toDateParent = $('#datetimepicker2').parent();

  // Update if change in FROM date
  fromDateParent.on('dp.change', function(e) {
    fromDate = e.date;
    document.patientForm.fromDate.value = e.date;
    // modify minimum date for TO calendar according to value from FROM calendar
    $('#datetimepicker2').data("DateTimePicker").minDate(e.date);
  });

  // Update if change in TO date
  toDateParent.on('dp.change', function(e) {
    toDate = e.date;
    document.patientForm.toDate.value = e.date;
  });
});

function countMedicine() {
  // get updated number of medicines
  medicineNumber = $('.selectpicker').selectpicker('val');

  if(medicineNumber === 'Select') {
    medicineNumber = 0;
  }
  medicineNumber = parseInt(medicineNumber);
  oldMedicineNumber = parseInt(oldMedicineNumber);

  // Toggle hidden class
  if (medicineNumber !== 1 && medicineNumber !== 2 && medicineNumber !== 3) {
    $('.medicine-container').addClass('hidden');
    for (var i = 3; i > 0; i--) {
      $('#medicineName' + i).remove();
      $('#dosageTime' + i).addClass('hidden');
      $('#dosageQuantity' + i).addClass('hidden');
    }
  }
  else {
    $('.medicine-container').removeClass('hidden');
  }

  // if current medicine number is more than previous than add input element otherwise remove
  if(medicineNumber < oldMedicineNumber) {
    //remove old input boxes and hide corresponding fields
    for (var i = oldMedicineNumber; i > medicineNumber; i--) {
      $('#medicineName' + i).remove();
      $('#dosageTime' + i).addClass('hidden');
      $('#dosageQuantity' + i).addClass('hidden');
    }
  }
  else {
    // add new input fields according to the new medicine number and make the corresponding fields visible
    for (var i = oldMedicineNumber; i < medicineNumber; i++) {
      $('.medicine-container').append('<div class="col-sm-4" id="medicineName' + (i+1) + '"><input type="text" name="medicineName' + (i+1) + '" class="form-control medicine-input" placeholder="Medicine Name ' + (i+1) + '"></div>');
      $('#dosageTime' + (i+1)).removeClass('hidden');
      $('#dosageQuantity' + (i+1)).removeClass('hidden');
    }
  }

  // update old medicine number for deletion in next iteration
  oldMedicineNumber = medicineNumber;
}

function addEvent()
{
  var summary = "Medicine Reminder";
  var description = ["","",""];
  for(var i=0;i<medicineNumber;i++)
    {
      if($('#morningCheckbox' + (i+1)).prop('checked'))
      description[0] += " Medicine " + (i+1) + ": " + $('#medicineName' + (i+1) + ' input').val();
      if($('#noonCheckbox' + (i+1)).prop('checked'))
      description[1] += " Medicine " + (i+1) + ": " + $('#medicineName' + (i+1) + ' input').val();
      if($('#nightCheckbox' + (i+1)).prop('checked'))
      description[2] += " Medicine " + (i+1) + ": " + $('#medicineName' + (i+1) + ' input').val();
    }
  console.log(description);
  var reccur =  Math.floor(( Date.parse(toDate) - Date.parse(fromDate) ) / 86400000);
  var reccurence = "RRULE:FREQ=DAILY;COUNT="+reccur;
    var event = {
    'summary': summary,
    'description': description[0],
    'transparency': 'transparent',
    'visibility': 'public',
    'start': {
      'dateTime': '2016-03-29T08:00:00',
      'timeZone': 'Asia/Kolkata'
    },
    'end': {
      'dateTime': '2016-03-29T09:00:00',
      'timeZone': 'Asia/Kolkata'
    },
    'recurrence': [
      reccurence
    ],
    'reminders': {
      'useDefault': false,
      'overrides': [{
        'method': 'email',
        'minutes': 60
      }, {
        'method': 'popup',
        'minutes': 10
      }]
    }
  };
    console.log(event);
}
