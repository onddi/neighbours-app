/**
* News.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {

  	housingId: {
      type: 'string',
      required: true
    },

    topic: {
    	type: 'string',
    	required: true
    },

    content: {
    	type: 'string',
    	required: true
    }

  }
};
