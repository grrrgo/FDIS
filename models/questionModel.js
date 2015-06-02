/**
 * Created by grrrgo on 5/25/15.
 */
var express = require('express');
var mongoose = require('mongoose');

var questionSchema = new mongoose.Schema({
    id: Number,
    content: String,
    choices: Object,
    correctChoice: String,
    category: String
});

module.exports = mongoose.model('questionModel', questionSchema);
