/**
* Housing.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {
  	 // The user's full name
    // e.g. Nikola Tesla
    address: {
      type: 'string',
      required: true
    },

    postalCode: {
    	type: 'integer',
    	required: true
    },

    city: {
    	type: 'string',
    	required: true
    }
  }
};

