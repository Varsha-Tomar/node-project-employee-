
$(document).ready(function () {
  $.getJSON("/employee/fetch_all_states", function (response) {
    response.data.map((item) => {
      $("#stateid").append(
        $("<option>").text(item.statename).val(item.stateid)
      );
    });
  });

  $("#stateid").change(function () {
    $.getJSON(
      "/employee/fetch_all_city",
      { stateid: $("#stateid").val() },
      function (response) {
        $("#cityid").empty();
        $("#cityid").append($("<option>").text("Select City"));

        response.data.map((item) => {
          $("#cityid").append(
            $("<option>").text(item.cityname).val(item.cityid)
          );
        });
      }
    );
  });

  $("#picture").change(function (event) {
    var file = URL.createObjectURL(event.target.files[0]);
    $("#epic").attr('src', file);
  });
});
