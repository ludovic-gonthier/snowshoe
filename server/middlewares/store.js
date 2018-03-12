import config from '../../config';
import filter from '../../common/github/result-filter';
import { INITIAL_STATE } from '../../client/reducers/github';

export default function (request, response, next) {
  const { query, user } = request;

  // eslint-disable-next-line no-param-reassign
  response.locals.state = Object.assign(
    {},
    {
      filters: {
        labels: [].concat(query.filter).filter((value) => !!value),
      },
      github: Object.assign(
        {},
        INITIAL_STATE,
        {
          token: request.isAuthenticated() ? user.accessToken : query.access_token || '',
          user: user ? filter(user._json, 'user') : null, // eslint-disable-line no-underscore-dangle
        }
      ),
      order: {
        direction: query.order_direction || config.get('snowshoe.pulls.sort.direction'),
        field: query.order_field || config.get('snowshoe.pulls.sort.key'),
      },
    });

  next();
}
