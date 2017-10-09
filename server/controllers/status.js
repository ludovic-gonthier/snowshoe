import { connection } from '../socket/listener';

export default (router) => {
  router.get('/status', (request, response, next) => {
    response.send(`socket connected: ${connection.socket}</br>user connected: ${connection.user}`);
  });
};
