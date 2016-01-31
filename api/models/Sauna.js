/**
* Sauna.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {

    timeslot: {
      type: 'string',
      required: true
    },

    userId: {
      type: 'string',
      required: true
    },

    housingId: {
      type: 'string',
      required: true
    },

    cancelled: {
      type: 'array',
      defaultsTo : []
    },

    extra: {
      type: 'array',
      defaultsTo : []
    }

  }
};
