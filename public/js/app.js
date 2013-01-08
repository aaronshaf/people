(function(angular,console) {
  "use strict";

  angular.module('notes', ['ngResource']).config(function($routeProvider) {
    $routeProvider.
      when('/', {templateUrl: 'partials/relationships.html',   controller: RelationshipsController}).
      when('/r/:relationshipId', {templateUrl: 'partials/relationship.html', controller: RelationshipController}).
      when('/settings', {templateUrl: 'partials/settings.html', controller: SettingsController}).
      otherwise({redirectTo: '/'});
  });

  function SettingsController($scope, $location) {
    $scope.settings.subtitle = " › " + "Settings"

    $scope.addNoteTemplate = function() {
      $scope.settings.noteTemplates.push({

      });
    };
  }

  function RelationshipsController($scope, $location, $resource) {
    $scope.settings.subtitle = '';

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
      var relationship = new Relationships({
        name: $scope.newRelationshipName
      });
      relationship.$save(function() {
        $scope.go(relationship);
      });
      $scope.relationships.push(relationship);
      $scope.newRelationshipName = '';
    };
  }

  function RelationshipController($resource, $scope, $rootScope, $routeParams, $location) {
    var Relationships = $resource('/relationships/:_id',{_id:'@_id'});
    $scope.relationship = Relationships.get({_id:$routeParams.relationshipId},function() {
      $scope.settings.subtitle = " › " + $scope.relationship.name;
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
  $scope.settings = {
    title: "Notes",
    subtitle: "",
    public_key: id() + id() + id() + id() + id(),
    private_key: id() + id() + id() + id() + id(),
    noteTemplates: []
  };

  $scope.goHome = function() {
    $location.path('/');
  };

  /*
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
  */
}

function id() {
  return Math.floor(Math.random() * 0x10000).toString(16);
}

function timestamp() {
  return Math.round((new Date()).getTime() / 1000);
}