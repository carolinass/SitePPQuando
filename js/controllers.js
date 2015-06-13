'use strict';

/* Controllers */

var phonecatApp = angular.module('phonecatApp', []);

phonecatApp.controller('PhoneListCtrl', ['$scope', '$http', function($scope, $http) {
    $scope.opa = [];
    $scope.firstTime = true;


    $http.get('dados/media_tags.json').success(function(data) {
        $scope.programacao = data;

    });

    $http.get('dados/tags.json').success(function(data) {
        $scope.tags = data;

    });

    $scope.format = function(data){
        return data.replace(/\//g, "");
    }

    $scope.hoverIn = function(){
    this.hoverEdit = true;
    };

    $scope.hoverOut = function(){
        this.hoverEdit = false;
    };
    
    $scope.orderProp = 'age';
    $scope.tagsAdded = [];
    $scope.includeTag = function(tag){
        var i = _.indexOf( $scope.tagsAdded,tag);
        if (i > -1) {
            $scope.tagsAdded.splice(i, 1);
        } else {
            $scope.tagsAdded.push(tag);
        }


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
            if (_.difference($scope.tagsAdded,_.keys(media)).length == 0){


                return data;
            }
        }
        return;
    }



}]);

