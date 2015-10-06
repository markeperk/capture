(function(){
  'use strict';

var app = angular.module('capture', [ 'ui.router' ]);

app.config(function($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.when('', '/');
    $urlRouterProvider.otherwise('/');
    $stateProvider
      .state('dashboard', {
        url: '/',
        templateUrl : 'app/templates/dashboard.html',
        controller  : 'dashboardCtrl'
      }); 
  });
})();