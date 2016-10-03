'use strict';

var _ = require('lodash');
var ProductGroup = require('./productGroup.model');
var Project = require('../project/project.model');

// Get list of productGroups
exports.index = function(req, res) {
  ProductGroup.find(function (err, productGroups) {
    if(err) { return handleError(res, err); }
    return res.status(200).json(productGroups);
  });
};

// Get a single productGroup
exports.show = function(req, res) {
  ProductGroup.findById(req.params.id, function (err, productGroup) {
    if(err) { return handleError(res, err); }
    if(!productGroup) { return res.status(404).send('Not Found'); }
    return res.json(productGroup);
  });
};

// Creates a new productGroup in the DB.
exports.create = function(req, res) {
  var projectId = req.body.projectId;
  console.log('projectId', projectId);
  ProductGroup.create(req.body, function(err, productGroup) {
    if(err) { return handleError(res, err); }
    Project.findById(projectId)
    .exec(function(err, project){
      project.productGroupTimeLine.push(productGroup._id);
      project.save(function(err, updatedProject){
        return res.status(201).json(productGroup);
      });
    });
  });
};

// Updates an existing productGroup in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  ProductGroup.findById(req.params.id, function (err, productGroup) {
    if (err) { return handleError(res, err); }
    if(!productGroup) { return res.status(404).send('Not Found'); }
    var updated = _.merge(productGroup, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.status(200).json(productGroup);
    });
  });
};

exports.increaseClickCount = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  ProductGroup.findById(req.params.id, function (err, productGroup) {
    if (err) { return handleError(res, err); }
    if(!productGroup) { return res.status(404).send('Not Found'); }
    
    if(productGroup.stats) {
      productGroup.stats.clickCount = (productGroup.stats.clickCount || 0) + 1;
    } else {
      productGroup.stats = {
        clickCount: 1
      };
    }

    productGroup.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.status(200).json(productGroup);
    });
  });
};


// Deletes a productGroup from the DB.
exports.destroy = function(req, res) {
  ProductGroup.findById(req.params.id, function (err, productGroup) {
    if(err) { return handleError(res, err); }
    if(!productGroup) { return res.status(404).send('Not Found'); }
    productGroup.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.status(204).send('No Content');
    });
  });
};

function handleError(res, err) {
  return res.status(500).send(err);
}