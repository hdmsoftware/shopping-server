'use strict';

var _ = require('lodash');
var Project = require('./project.model');
var Product = require('../product/product.model');

var returnProject = function(req, res) {
  var populateDetails = req.params.populateDetails || req.body.populateDetails;
  if(req.body.populateDetails) { delete req.body.populateDetails; }
  console.log('populateDetails', populateDetails, req.params.id);
  if(populateDetails) {
    Project.findById(req.params.id)
    .populate('productGroupTimeLine')
    .exec(function(err, project){
      if(err) { return handleError(res, err); }
      if(!project) { return res.status(404).send('Not Found'); }
      console.log('project._id', project._id);
      Project.populate(project, { 
        path: 'productGroupTimeLine.products',
        model: 'Product' 
      }, function(err, updatedProject) {
        // console.log('populated: ', updatedProject.productGroupTimeLine);
        if(err) {
          console.log('error populating products');
          return res.status(500).json({
            err: err,
            message: 'error populating products'
          });
        }
        return res.json(project);
      });
      // return res.json(project);
    });
  } else {
    Project.findById(req.params.id)
    .exec(function(err, project){
      console.log('project', project);
      if(err) { return handleError(res, err); }
      if(!project) { return res.status(404).send('Not Found'); }
      res.json(project);
    });
  }
};
// Get list of projects
exports.index = function(req, res) {
  var activeOnly = req.query.activeOnly == true || req.query.activeOnly == 'true'?true:false;
  var testing = req.query.testing == true || req.query.testing == 'true'?true:false;
  var query = {};
  if(activeOnly) {
    query = {
      $or: []
    }
    query.$or.push({
      active: true
    });
  }
  if(testing) {
    if(!query.$or) query = {
      $or: []
    }
    query.$or.push({
      testing: true
    });
  }
  Project.find(query)
  // sorting from newest to oldest
  .sort([['_id', -1]])
  .exec(function (err, projects) {
    if(err) { return handleError(res, err); }
    return res.status(200).json(projects);
  });
};

// Get a single project
exports.show = function(req, res) {
  returnProject(req, res);
};

// Creates a new project in the DB.
exports.create = function(req, res) {
  Project.create(req.body, function(err, project) {
    if(err) { return handleError(res, err); }
    return res.status(201).json(project);
  });
};

// Updates an existing project in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Project.findById(req.params.id, function (err, project) {
    if (err) { return handleError(res, err); }
    if(!project) { return res.status(404).send('Not Found'); }
    var updated = _.merge(project, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      returnProject(req, res);
    });
  });
};

exports.increaseVideoWatchCount = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Project.findById(req.params.id, function (err, project) {
    if (err) { return handleError(res, err); }
    if(!project) { return res.status(404).send('Not Found'); }
    
    if(project.stats) {
      project.stats.videWatchCount = (project.stats.videWatchCount || 0) + 1;
    } else {
      project.stats = {
        videWatchCount: 1
      };
    }
    
    project.save(function (err) {
      if (err) { return handleError(res, err); }
      returnProject(req, res);
    });
  });
};

exports.increaseWatchCount = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Project.findById(req.params.id, function (err, project) {
    if (err) { return handleError(res, err); }
    if(!project) { return res.status(404).send('Not Found'); }
    
    if(project.stats) {
      project.stats.watchCount = (project.stats.watchCount || 0) + 1;
    } else {
      project.stats = {
        watchCount: 1
      };
    }
    
    project.save(function (err) {
      if (err) { return handleError(res, err); }
      returnProject(req, res);
    });
  });
};

exports.increaseVideoClickCount = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Project.findById(req.params.id, function (err, project) {
    if (err) { return handleError(res, err); }
    if(!project) { return res.status(404).send('Not Found'); }
    
    if(project.stats) {
      project.stats.videoClickCount = (project.stats.videoClickCount || 0) + 1;
    } else {
      project.stats = {
        videoClickCount: 1
      };
    }
    
    project.save(function (err) {
      if (err) { return handleError(res, err); }
      returnProject(req, res);
    });
  });
};

// Deletes a project from the DB.
exports.destroy = function(req, res) {
//   Project.findById(req.params.id, function (err, project) {
//     if(err) { return handleError(res, err); }
//     if(!project) { return res.status(404).send('Not Found'); }
//     project.remove(function(err) {
//       if(err) { return handleError(res, err); }
//       return res.status(204).send('No Content');
//     });
//   });
};

function handleError(res, err) {
  return res.status(500).send(err);
}