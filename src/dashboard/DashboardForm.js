$(function() {
  $('#datetimepicker1').datetimepicker({
    format: 'DD MMM YYYY',
    inline: true
  });
  $('#datetimepicker2').datetimepicker({
    format: 'DD MMM YYYY',
    inline: true
  });
  // console.log('calendar linked\n', $('#datetimepicker1').data("DateTimePicker").date());

  var fromDate = $('#datetimepicker1').data("DateTimePicker").date();
  var toDate = $('#datetimepicker2').data("DateTimePicker").date();
  console.log("fromDate= \n"+fromDate);
  console.log("toDate= \n"+toDate);

  var fromDateParent = $('#datetimepicker1').parent();
  var toDateParent = $('#datetimepicker2').parent();

  fromDateParent.on('dp.change', function(e) {
    var fromDate = e.date;
    console.log("new fromDate= \n"+fromDate);
  });
  toDateParent.on('dp.change', function(e) {
    var toDate = e.date;
    console.log("new toDate= \n"+toDate);
  });
});
