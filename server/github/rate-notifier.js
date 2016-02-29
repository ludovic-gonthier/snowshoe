import Promise from 'promise';

export default function (socket) {
  return function notify(data) {
    if (data.headers['x-ratelimit-limit']
       && data.headers['x-ratelimit-remaining']
       && data.headers['x-ratelimit-reset']) {
      socket.emit('rate', {
        limit: data.headers['x-ratelimit-limit'],
        remaining: data.headers['x-ratelimit-remaining'],
        reset: data.headers['x-ratelimit-reset'],
      });
    }

    return Promise.resolve(data);
  };
}
