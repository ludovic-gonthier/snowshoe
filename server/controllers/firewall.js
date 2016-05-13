export default (router) => {
  /*
   * Simple firewall
   */
  router.all(/^((?!\/(login|auth\/github)).)/, (request, response, next) => {
    if (request.isAuthenticated() || request.query.access_token) {
      return next();
    }

    response.redirect('/login');
  });
};
