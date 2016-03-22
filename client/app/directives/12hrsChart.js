/**
 * Created by djamr on 3/21/2016.
 */

'use strict';

var directives = directives || angular.module('gifmage.directives', []);

directives.directive('recentViewsChart', ['ImageService', function(ImageService){
    return {
        restrict: 'AE',
        scope: {
            showChart: '=showChart'
        },
        link: function(scope, element, attrs) {

            // make an API call to get the corresponding log for this image
            ImageService.getRecentViewsLog({id: attrs.imageid}, function(recentLog) {

                // return if the call did not execute correctly
                if (!recentLog.id) {
                    console.log("This image is not new enough for 'last 12 hrs' views");
                    return;
                }

                // have data, can enable showing the chart
                scope.showChart = true;

                // create the corresponding hour indexes to show in the graph
                var hourIndexes = [];
                var currentHour = Number(moment(new Date()).format("H"));
                for (var i = 0; i < 12; i++) {
                    hourIndexes.unshift((currentHour - i) % 24);
                }

                // create the 'labels' data set
                var labels = [];
                for (var i = 0; i < hourIndexes.length; i++) {

                    var hour = String((hourIndexes[i]) % 12);

                    if (hour === "0") {
                        hour = "12";
                    }

                    if (hourIndexes[i] > 11) {
                        hour += "pm";
                    } else {
                        hour += "am";
                    }

                    labels.push(hour);
                }

                // build the correct data based off of hourIndexes
                var data = [];
                for (var i = 0; i < hourIndexes.length; i++) {
                    data.push( recentLog.views[ hourIndexes[i] ] );
                }

                var data = {

                    labels: labels,

                    datasets: [
                        {
                            label: "Last 12hrs",
                            fillColor: "rgba(220,220,220,0.2)",
                            strokeColor: "rgba(220,220,220,1)",
                            pointColor: "rgba(220,220,220,1)",
                            pointStrokeColor: "#fff",
                            pointHighlightFill: "#fff",
                            pointHighlightStroke: "rgba(220,220,220,1)",
                            data: data
                        }
                    ]

                };

                var ctx = document.getElementById("12hrsChart").getContext("2d");
                var chart = new Chart(ctx).Line(data);
                
            });
            
        }
    };
}]);
