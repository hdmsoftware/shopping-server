'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var ProjectSchema = new Schema({
	name: String,
	description: String,
	media: {
		url               : String,
		original_filename : String,
		public_id         : String,
		secure_url        : String,
		signature         : String
	},
	thumbnail: {
		url               : String,
		original_filename : String,
		public_id         : String,
		secure_url        : String,
		signature         : String
	},
	stats: {
		watchCount: { type: Number, default: 0 },
		videoClickCount : { type: Number, default: 0 },
		videWatchCount: { type: Number, default: 0 }
	},
	productGroupTimeLine : [ { type: Schema.Types.ObjectId, ref: 'ProductGroup' } ],
	createdAt    : { type: Date },
	updatedAt    : { type: Date },
	active: { type: Boolean, default: false },
	testing: { type: Boolean, default: false }
});

ProjectSchema.pre('save', function(next){
  var now = new Date();
  this.updatedAt = now;
  if ( !this.createdAt ) {
    this.createdAt = now;
  }
  next();
});

module.exports = mongoose.model('Project', ProjectSchema);