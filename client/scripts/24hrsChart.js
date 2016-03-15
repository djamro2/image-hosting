
$(document).ready(function() {

   var data = {
        
       labels: ["12am", "1am", "2am", "3am", "4am", "5am", "6am", "7am", "8am", "9am", "10am", "11am"],
        
        datasets: [
            {
            label: "Last 24hrs",
            fillColor: "rgba(220,220,220,0.2)",
            strokeColor: "rgba(220,220,220,1)",
            pointColor: "rgba(220,220,220,1)",
            pointStrokeColor: "#fff",
            pointHighlightFill: "#fff",
            pointHighlightStroke: "rgba(220,220,220,1)",
            data: [65, 59, 80, 81, 56, 55, 40, 80, 45, 10, 11, 43]
            }
        ]

   };

   // Get context with jQuery - using jQuery's .get() method.
   var ctx = document.getElementById("24hrsChart").getContext("2d");
   var chart = new Chart(ctx).Line(data);

});

