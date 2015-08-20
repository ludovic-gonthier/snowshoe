'use strict';

var router = require('./index').Router;

/*
 * Handle 404 errors
 */
router.get('*', function(request, response){
  response.status(404).send('404 - Not Found');
});
