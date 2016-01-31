angular.module('backend.services', ['ngResource'])
.factory('DataBaseService', ['$resource', function($resource) {
//Variable to switch from local backend URL to production backend URL
var BEurl;
var local = true;

if(local)
 BEurl = 'http://localhost:1337'
else {
 BEurl = 'https://neighbours-app-test.herokuapp.com';
}

return {
		news: $resource(''+BEurl+'/news/:id?', null,
		    {
	        'get'  :  {method:'GET'},
  				'save':   {method:'POST'},
		    	'query': { method: 'GET', params: {}, isArray: true },
	        'update': { method:'PUT' },
	        'delete': { method:'DELETE' }
		    }),
		note: $resource(''+BEurl+'/note/:id?', null,
		    {
	        'get'  :  {method:'GET'},
  				'save':   {method:'POST'},
		    	'query': { method: 'GET', params: {}, isArray: true },
	        'update': { method:'PUT' },
	        'delete': { method:'DELETE' }
		    }),
		housing: $resource(''+BEurl+'/housing/:id?', null,
		    {
		    	'get'  :  {method:'GET'},
  				'save':   {method:'POST'},
		    	'query': { method: 'GET', params: {}, isArray: true },
	        'update': { method:'PUT' },
	        'delete': { method:'DELETE' }
		    }),
		users: $resource(''+BEurl+'/user/:id?', null,
		    {
		    	'get'  :  {method:'GET'},
  				'save':   {method:'POST'},
		    	'query': { method: 'GET', params: {}, isArray: true },
	        'update': { method:'PUT' },
	        'delete': { method:'DELETE' }
		    }),
		sauna: $resource(''+BEurl+'/sauna/:id?', null,
		    {
		    	'get'  :  {method:'GET'},
  				'save':   {method:'POST'},
		    	'query': { method: 'GET', params: {}, isArray: true },
	        'update': { method:'PUT' },
	        'delete': { method:'DELETE' }
		    }),
		getBEurl: { BEurl: BEurl }
	}
}])
