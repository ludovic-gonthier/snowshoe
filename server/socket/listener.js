import async from 'async';
import Promise from 'promise';

import { config } from '../../config';
import fetcher from '../github/fetcher';
import Poller from '../poller';

const poller = new Poller(config.get('snowshoe.refresh.rate'));
poller.callback = (data) => {
  const github = data.fetcher;

  return github
    .repositories(data.url)
    .then(repositories => {
      async
        .each(repositories, (repository, callback) => {
          github.pulls(repository)
            .then(pulls => {
              callback();

              if (pulls.length) {
                github.statuses(pulls).catch(callback);
                github.issues(repository).catch(callback);
              }
            }).catch(error => {
              console.error(error); // eslint-disable-line no-console
              callback();
            });
        }, error => {
          if (error) {
            return console.error(error); // eslint-disable-line no-console
          }

          github.removeClosedPulls();

          return Promise.resolve();
        });
    });
};

export default function (socket) {
  let github;

  socket.on('disconnect', () => {
    poller.unregister(socket);
    socket = null; // eslint-disable-line no-param-reassign
    github = null;
  });

  socket.on('error', (error) => {
    /* eslint-disable no-console */
    console.error('[Socket error]');
    console.dir(error);
    console.error('[/Socket error]');
    /* eslint-enable no-console */
  });

  socket.on('user', data => {
    const token = data.accessToken;
    github = fetcher(socket, token);

    socket.on('pulls', url => {
      const object = {
        url,
        fetcher: github,
      };

      poller.register(object, socket);
      poller.callback(object, socket);
    });

    github.organizations()
      .catch(error => {
        console.error(error); // eslint-disable-line no-console
      });

    socket.on('team', organizationLogin => {
      github.teams(organizationLogin);
    });
  });
}
