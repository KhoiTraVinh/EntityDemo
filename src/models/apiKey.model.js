'use strict'
const {Schema, model} = require('mongoose'); // Erase if already required
const COLLECTION_NAME = 'ApiKeys';
const DOCUMENT_NAME = 'ApiKey';

// Declare the Schema of the Mongo model
var apiKeySchema = new Schema({
    key:{
        type: String,
        required: true,
        unique: true
    },
    status:{
        type: Boolean,
        default: true,
    },
    permissions: {
        type: [String],
        required: true,
        enum: ['00', '11', '22'],
    },
}, {
    collection: COLLECTION_NAME,
    timestamps: true
});

//Export the model
module.exports = model(DOCUMENT_NAME, apiKeySchema);