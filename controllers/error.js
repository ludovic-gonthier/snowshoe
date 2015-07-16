'use strict';

var router = require('./index').Router;

/*
 * Handle 404 errors
 */
router.get('*', function(request, response){
  response.send('404 - Not Found', 404);
});
