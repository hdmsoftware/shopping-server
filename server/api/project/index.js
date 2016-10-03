'use strict';

var express = require('express');
var controller = require('./project.controller');
var auth = require('../../auth/auth.service');

var router = express.Router();

router.get('/', controller.index);
router.get('/:id/:populateDetails', controller.show);
router.put('/:id/count/videowatch', controller.increaseVideoWatchCount);
router.put('/:id/count/videoclick', controller.increaseVideoClickCount);
router.put('/:id/count/watch', controller.increaseWatchCount);

router.post('/', auth.isAuthenticated(), controller.create);
router.put('/:id', auth.isAuthenticated(), controller.update);
router.patch('/:id', auth.isAuthenticated(), controller.update);
router.delete('/:id', auth.isAuthenticated(), controller.destroy);

module.exports = router;