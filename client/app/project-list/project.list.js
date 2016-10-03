'use strict';

angular.module('cmsShoppableApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('project-list', {
        url: '/',
        templateUrl: 'app/project-list/project-list.html',
        controller: 'ProjectListCtrl',
        authenticate: true
      });
  });