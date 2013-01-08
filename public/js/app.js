(function(angular,console) {
  "use strict";

  angular.module('relationships', ['ngResource']).config(function($routeProvider) {
    $routeProvider.
      when('/', {templateUrl: 'partials/relationships.html',   controller: RelationshipsController}).
      when('/r/:relationshipId', {templateUrl: 'partials/relationship.html', controller: RelationshipController}).
      when('/settings', {templateUrl: 'partials/settings.html', controller: SettingsController}).
      otherwise({redirectTo: '/'});
  });

  function SettingsController($scope, $location) {

  }

  function RelationshipsController($scope, $location, $resource) {
    var Relationships = $resource('/relationships/:_id');

    $scope.reverse = false;
    $scope.predicate = 'name';

    $scope.relationships = Relationships.query();

    $scope.testSort = function() {
      $scope.predicate = 'name';
      $scope.reverse = !$scope.reverse;
    };

    $scope.go = function(relationship) {
      $location.path('/r/' + relationship._id);
    };

    $scope.add = function() {
      //var id = id();
      //$location.path('/r/' + id);

      var relationship = new Relationships({
        name: $scope.newRelationshipName
      });
      relationship.$save();
      $scope.relationships.push(relationship);
      $scope.newRelationshipName = '';
      //$location.path('/r/add');
    };
  }

  function RelationshipController($resource, $scope, $rootScope, $routeParams, $location) {
    var Relationships = $resource('/relationships/:_id',{_id:'@_id'});
    $scope.relationship = Relationships.get({_id:$routeParams.relationshipId},function() {
      $scope.$watch('relationship',function(oldValue,newValue) {
        if(angular.equals(oldValue,newValue)) {
          return;
        }
        $scope.relationship.$save();
      },true);
    });

    $scope.remove = function(contact) {
      $scope.relationship.$remove();
      $location.path('/');
    };

    $scope.addNote = function() {
      if(!$scope.relationship.notes) {
         $scope.relationship.notes = [];
      }
      $scope.relationship.notes.push({
        content: $scope.noteContent,
        created: timestamp()
      });
      $scope.noteContent = "";
    };

    $scope.save = function() {
      $scope.relationship.$save();
    };
  }
}(angular,console));

function AppController($scope,$location) {
  var id = '88825f'; //Math.floor(Math.random() * 0x10000).toString(16);

  $scope.goHome = function() {
    $location.path('/');
  };

  $scope.relationships = [{
    _id: id,
    name: 'John Doe',
    contacts: [
      {
        content: "(801) 555-1212",
        description: "Mom's cell"
      },
      {
        content: "(801) 555-3434",
        description: "Dad's cell"
      }
    ],
    notes: [],
    summary_note: '[Summary notes]',
    created: timestamp()
  },{
    _id: id,
    name: 'Jane Smith',
    contacts: [
      {
        content: "(801) 555-1212",
        description: "Mom's cell"
      },
      {
        content: "(801) 555-3434",
        description: "Dad's cell"
      }
    ],
    notes: [],
    summary_note: '[Summary notes]',
    created: timestamp()
  }];
}

function id() {
  return Math.floor(Math.random() * 0x10000).toString(16);
}

function timestamp() {
  return Math.round((new Date()).getTime() / 1000);
}