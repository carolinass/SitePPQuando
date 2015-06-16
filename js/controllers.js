'use strict';

/* Controllers */

var phonecatApp = angular.module('phonecatApp', []);

phonecatApp.controller('PhoneListCtrl', ['$scope', '$http', function($scope, $http) {
    $scope.opa = [];
    $scope.firstTime = true;
    $scope.programacao = []
    $scope.tags = []
    $scope.imgs = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23", "24", "25", "26", "27", "28", "29"]
    $scope.modals = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29]


    $http.get('dados/media_tags.json').success(function(data) {

        $scope.programacao = data;

        $scope.diasAnteriores =  _.filter(data, function(date){
            var from = date.data.split("/");
            var currentDate = new Date(2000 + Number(from[2]), from[1] - 1,from[0]);
            var today = new Date();
            today.setHours(0,0,0,0)

            return currentDate < today;
        });;
        $scope.diasFaltam =  _.filter(data, function(date){
            var from = date.data.split("/");
            var currentDate = new Date(2000 + Number(from[2]), from[1] - 1,from[0]);
            var today = new Date();
            today.setHours(0,0,0,0)

            return +currentDate >= +today;


        });;

    });

    $http.get('dados/tags.json').success(function(data) {
        //var todos = {"count": 100,"tag":"TODOS"};

        //$scope.tags = todos;
        $scope.tags = data;

    });

    $scope.format = function(data){
        return data.replace(/\//g, "");
    };

    $scope.getIndex = function(data){
        return _.indexOf( $scope.programacao,data) + 1;
    };

    //$scope.mostrarModal = function(id){
    //    var a = 1;
    //}
    //
    $scope.orderProp = 'age';
    $scope.tagsAdded = [];
    $scope.includeTag = function(tag){
        $scope.tagsAdded = [tag]
        //var i = _.indexOf( $scope.tagsAdded,tag);
        //if (i > -1) {
        //    $scope.tagsAdded.splice(i, 1);
        //} else {
        //    $scope.tagsAdded.push(tag);
        //}


    };
    $scope.imChanged = function(opa,tag){

        if ($scope.firstTime){
            $scope.phonesSelected = [];
            $scope.firstTime =false;
        }
        if (opa){
            $scope.phonesSelected.push(phone);
        }else{
            var i = _.indexOf( $scope.phonesSelected,phone);
            $scope.phonesSelected.splice(i, 1);

        }
    };


    $scope.filtro = function(data) {
        var media = data.media_tags;
        if ($scope.tagsAdded.length > 0) {
            if ($scope.tagsAdded[0] == "TODOS"){
                return data;
            }

            if (_.difference($scope.tagsAdded,_.keys(media)).length == 0){
                return data;
            }
        }else{
            return data;
        }
    }

}]);

phonecatApp.directive('barChart', function($parse,$window){
    return{
        restrict:'EA',
        template:"<svg style='width:100%'></svg>",
        //scope: {
        //    bardata: "="
        //},
        link: function(scope, elem, attrs){

            $window.onresize = function() {
                scope.$apply();
            };
            scope.$watch(function() {
                return angular.element($window)[0].innerWidth;
            }, function() {
                scope.render(scope.data);
            });



            //var margin = parseInt(attrs.margin) || 20,
            //    barHeight = parseInt(attrs.barHeight) || 20,
            //    barPadding = parseInt(attrs.barPadding) || 5;
            //



            scope.render = function (data) {

                var data1=data;
                var data = _.map(data1.media_tags, function (value,key) {
                    return {'letter':key,'frequency':value}
                })

                data = _.sortBy(data,'frequency');

                var d3 = $window.d3;
                console.log("WIDTH " + d3.select(elem[0]).node().offsetWidth);

                var rawSvg=elem.find('svg');
                var svg = d3.select(rawSvg[0]);
                svg.selectAll("*").remove();

                var margin = {top: 20, right: 20, bottom: 20, left: 70},
                    height = 200 - margin.top - margin.bottom;

                var width = d3.select(elem[0]).node().offsetWidth;
                    //height = data1.length * (barHeight + barPadding);
                if (width == 0){
                    width = 500 - margin.left - margin.right;
                }
                width = width - margin.left;
                var x = d3.scale.linear()
                    .range([0, width]);

                var y = d3.scale.ordinal()
                    .rangeRoundBands([height, 0],.1);


                //var svg = d3.select("#teste").append("svg")
                svg .style('width', '100%')
                    //.attr("width", width + margin.left + margin.right)
                    .attr("height", height + margin.top + margin.bottom)
                    .append("g")
                    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

                //d3.tsv("data.tsv", type, function(error, data) {

                x.domain([0, d3.max(data, function(d) { return d.frequency; })]);
                y.domain(data.map(function(d) { return d.letter; }));

                var xAxis = d3.svg.axis()
                    .scale(x)
                    .orient("bottom")
                    .ticks(10, "%");

                var yAxis = d3.svg.axis()
                    .scale(y)
                    .orient("left")

                svg.append("g")
                    .attr("class", "x axis")
                    .attr("transform", "translate("+margin.left+"," + height + ")")
                    .call(xAxis);

                svg.append("g")
                    .attr("class", "y axis")
                    .attr("transform", "translate("+margin.left +"," + 0 + ")")
                    .call(yAxis);

                svg.selectAll(".bar")
                    .data(data)
                    .enter().append("rect")
                    .attr("class", "bar")
                    .attr("x", function(d) { return margin.left; })
                    .attr("width",function(d){ return x(d.frequency);})
                    .attr("y", function(d) { return y(d.letter); })
                    .attr("height", function(d) { return y.rangeBand(); });

                var insertLinebreaks = function (d) {
                    var el = d3.select(this);
                    var words = d.split(' ');
                    el.text('');
                    var string = "";
                    el.append('tspan').text(words[0]);

                    for (var i = 1; i < words.length; i++) {
                        string += words[i] + " ";
                    }
                    if (words.length > 1){
                        var tspan = el.append('tspan').text(string);
                        tspan.attr('x', 0).attr('dy', '11');

                    }
                };

                svg.selectAll('g.y.axis g.tick text').each(insertLinebreaks);

            }


        }
    };
});
