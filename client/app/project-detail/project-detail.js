'use strict';

angular.module('cmsShoppableApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('project-detail', {
        url: '/project-detail/:projectId',
        templateUrl: 'app/project-detail/project-detail.html',
        controller: 'ProjectDetailCtrl',
        authenticate: true
      });
  });