'use strict';

angular.module('cmsShoppableApp')
  .controller('ProjectListCtrl', function ($scope, $http, $uibModal, projectService) {
	console.log('ProjectListCtrl');
	var addProductGroupModalInstance = null;

	$scope.addProject = function() {
		addProductGroupModalInstance = $uibModal.open({
			animation: true,
			templateUrl: 'app/project-list/add-project.html',
			scope: $scope,
			backdrop: 'static',
			windowClass: 'add-project-modal'
	    });

	    addProductGroupModalInstance.result.then(function (project) {
	      console.log('project: ', project);
	    }, function () {
	      $log.info('Modal dismissed at: ' + new Date());
	    });
	};

	$scope.save = function(valid, project) {
		if(!valid) {
			return false;
		}
		projectService.addProject(project)
		.success(function(project){
			$scope.projectList.push(project);
		})
		.error(function(err){
			console.log('err adding project');
		});
		addProductGroupModalInstance.close(project);
	};

	$scope.cancel = function(project) {
		addProductGroupModalInstance.close();
	};

	projectService.getProjects()
	.success(function(projectList){
		$scope.projectList = projectList;
	})
	.error(function(err){
		console.log('err fetching project list');
	})

  });
