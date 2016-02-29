export default (router) => {
  /*
   * Handle 404 errors
   */
  router.get('*', (request, response) => {
    response.status(404).send('404 - Not Found');
  });
};
