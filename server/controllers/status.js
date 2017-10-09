import { SOCKET_CONNECTION } from '../socket/listener';

export default (router) => {
  router.get('/status', (request, response, next) => {
    response.send(`connected: ${SOCKET_CONNECTION}`);
  });
};
