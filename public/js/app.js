(function(angular,console) {
  "use strict";

  angular.module('crm', []).config(function($routeProvider,$resource) {
    $routeProvider.
      when('/', {templateUrl: 'partials/relationships.html',   controller: PeopleController}).
      when('/p/:personId', {templateUrl: 'partials/relationship.html', controller: PersonController}).
      otherwise({redirectTo: '/'});
  });

  function PeopleController($scope, $location) {
    $scope.reverse = false;
    $scope.predicate = 'name';

    $scope.testSort = function() {
      $scope.predicate = 'name';
      $scope.reverse = !$scope.reverse;
    };

    $scope.go = function(person) {
      $location.path('/r/' + person._id);
    };

    $scope.add = function() {
      var id = Math.floor(Math.random() * 0x10000).toString(16);
      $scope.relationship[id] = {
        _id: id,
        contacts: [],
        notes: [],
        created: timestamp()
      };
      $location.path('/r/' + id);
    };
  }

  function PersonController($scope, $rootScope, $routeParams, $location, $resource) {
    $scope.person = $scope.people[$routeParams.personId];


    var People = $resource('/people/:personId');
    var user = People.get({$routeParams.personId}, function() {
      user.abc = true;
      //user.$save();
    });

    $scope.remove = function(contact) {
      //delete contact;
    };

    $scope.addNote = function() {
      $scope.person.notes.push({
        content: $scope.noteContent,
        created: timestamp()
      });
      $scope.noteContent = "";
    };
  }
}(angular,console));

function AppController($scope,$location) {
  var id = '88825f'; //Math.floor(Math.random() * 0x10000).toString(16);

  $scope.goHome = function() {
    $location.path('/');
  };

  //$scope.people = {};

  $scope.people = [{
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

function timestamp() {
  return Math.round((new Date()).getTime() / 1000);
}