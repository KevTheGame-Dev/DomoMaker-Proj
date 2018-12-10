// const crypto = require('crypto');
const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

let GroupModel = {};

const GroupSchema = new mongoose.Schema({
  groupname: {
    type: String,
    required: true,
    trim: true,
    unique: true,
    match: /^[A-Za-z0-9_\-.]{1,16}$/,
  },

  users: {
    type: Array,
    default: [],
    required: true,
  },

  admins: {
    type: Array,
    default: [],
    required: true,
  },

  createdDate: {
    type: Date,
    default: Date.now,
  },
});

GroupSchema.statics.toAPI = doc => ({
  // _id is built into your mongo document and is guaranteed to be unique
  groupname: doc.groupname,
  users: doc.users,
  admins: doc.admins,
  _id: doc._id,
});

GroupSchema.statics.findByGroupname = (name, callback) => {
  const search = {
    groupname: name,
  };

  return GroupModel.findOne(search, callback);
};

GroupSchema.statics.getGroupUsers = (groupname, callback) => {
  GroupModel.findByGroupname(groupname, (err, doc) => {
    if (err) { return callback(err); }
    if (!doc) { return callback(); }

    return callback(doc.users);
  });
};

GroupSchema.statics.getGroupAdmins = (groupname, callback) => {
  GroupModel.findByGroupname(groupname, (err, doc) => {
    if (err) { return callback(err); }
    if (!doc) { return callback(); }

    return callback(doc.admins);
  });
};

GroupModel = mongoose.model('Group', GroupSchema);

module.exports.GroupModel = GroupModel;
module.exports.GroupSchema = GroupSchema;
