(function(){
  'use strict';

var app = angular.module('capture', [ 'ui.router']);

//config
app
  // .run(function($state,$rootScope){
  //   $rootScope.$state = $state;
  // })
  .config(function($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.when('', '/');
    $urlRouterProvider.otherwise('/');
    $stateProvider
      .state('dashboard', {
          url: '/',
          templateUrl : 'app/templates/dashboard.html',
          controller  : 'dashboardCtrl'
          // resolve: {
          //   stats: function(adminService, $q, $stateParams){
          //     var location = $stateParams.id; 
          //     var dfd = $q.defer();
          //       adminService.getStatsByLocation(location)
          //       .then(function(stats){
          //         console.log("dashboard routers stats.data is", stats.data); 
          //         dfd.resolve(stats.data[0]);
          //       });
          //     return dfd.promise;
          //   }
          // }
      }); 
  });

})();