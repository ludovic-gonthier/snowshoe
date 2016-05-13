import { default as passport } from './passport';

const scope = [
  'read:org',
  'repo',
  'user',
];

export default (router) => {
  router.get('/login', (request, response) => {
    response.render('pages/login.jsx');
  });

  router.get('/auth/github', passport.authenticate('github', {
    scope,
  }));
  router.get(
    '/auth/github/callback',
    passport.authenticate('github', { failureRedirect: '/login' }),
    (request, response) => response.redirect('/')
  );

  router.get('/logout', (request, response) => {
    request.session.destroy();
    request.logout();
    response.redirect('/login');
  });
};
