import passport from '../../../server/controllers/passport';
import authentification from '../../../server/controllers/authentification';

jest.mock('../../../server/controllers/passport', () => ({
  authenticate: jest.fn(),
}));

describe('Controllers - authentification', () => {
  describe('Unit test', () => {
    const router = {
      get: jest.fn(),
    };
    const request = {
      logout: jest.fn(),
      session: {
        destroy: jest.fn(),
      },
    };
    const response = {
      redirect: jest.fn(),
      render: jest.fn(),
    };

    beforeEach(() => {
      jest.resetAllMocks();

      const controller = jest.fn(() => {});

      passport.authenticate = jest.fn(() => controller);
      passport.authenticate.controller = controller;
    });

    it('should have registered all authentification routes', () => {
      authentification(router);

      expect(router.get.mock.calls[0])
        .toEqual(['/login', expect.any(Function)]);
      expect(router.get.mock.calls[1])
        .toEqual(['/auth/github', expect.any(Function)]);
      expect(router.get.mock.calls[2])
        .toEqual(['/auth/github/callback', expect.any(Function), expect.any(Function)]);
      expect(router.get.mock.calls[3])
        .toEqual(['/logout', expect.any(Function)]);
    });

    describe('GET /login', () => {
      it('should render the login page', () => {
        router.get
          .mockImplementation((route, callback) => {
            if (route === '/login') {
              callback(request, response);
            }
          });

        authentification(router);

        expect(response.render)
          .toHaveBeenCalledWith('pages/login.jsx');
      });
    });

    describe('GET /auth/github', () => {
      it('should call passport github authentication page', () => {
        router.get
          .mockImplementation((route, callback) => {
            if (route === '/auth/github') {
              callback(request, response);
            }
          });

        authentification(router);

        expect(passport.authenticate)
          .toHaveBeenCalledWith('github', { scope: ['read:org', 'repo', 'read:user'] });
        expect(passport.authenticate.controller)
          .toHaveBeenCalledWith(request, response);
      });
    });

    describe('GET /auth/github/callback', () => {
      it('should call redirect after login', () => {
        router.get
          .mockImplementation((route, cb1, cb2) => {
            if (route === '/auth/github/callback') {
              cb1(request, response);
              cb2(request, response);
            }
          });

        authentification(router);

        expect(passport.authenticate)
          .toHaveBeenCalledWith('github', { failureRedirect: '/login' });
        expect(passport.authenticate.controller)
          .toHaveBeenCalledWith(request, response);
        expect(response.redirect)
          .toHaveBeenCalledWith('/');
      });
    });

    describe('GET /logout', () => {
      it('should logthe user out and redirect to login', () => {
        router.get
          .mockImplementation((route, callback) => {
            if (route === '/logout') {
              callback(request, response);
            }
          });

        authentification(router);

        expect(request.session.destroy)
          .toHaveBeenCalled();
        expect(request.logout)
          .toHaveBeenCalled();
        expect(response.redirect)
          .toHaveBeenCalledWith('/login');
      });
    });
  });

  describe('Functional test', () => {
  });
});
