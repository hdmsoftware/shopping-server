'use strict';

angular.module('cmsShoppableApp')

.factory('projectService', function($http) {
	var addProject = function(project) {
		return $http.post('/api/projects', project);
	};
	var getProjects = function() {
		return $http.get('/api/projects');
	};
	return {
		addProject		: addProject,
		getProjects 	: getProjects
	}
})