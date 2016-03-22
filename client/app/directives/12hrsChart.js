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
            ImageService.getRecentViewsLog({id: attrs.imageid}, function(result) {

                // return if the call did not execute correctly
                if (!result.data) {
                    console.log("This image is not new enough for 'last 12 hrs' views");
                    return;
                }

                // can enable showing the chart
                scope.showChart = true;

                // pass data received from the call and create the chart
                var data = {

                    labels: result.labels,

                    datasets: [
                        {
                            label: "Last 12hrs",
                            fillColor: "rgba(220,220,220,0.2)",
                            strokeColor: "rgba(220,220,220,1)",
                            pointColor: "rgba(220,220,220,1)",
                            pointStrokeColor: "#fff",
                            pointHighlightFill: "#fff",
                            pointHighlightStroke: "rgba(220,220,220,1)",
                            data: result.data
                        }
                    ]

                };

                // find the element and create a new line chart. Pass in options here
                var ctx = document.getElementById("12hrsChart").getContext("2d");
                var chart = new Chart(ctx).Line(data);
                
            });
            
        }
    };
}]);
