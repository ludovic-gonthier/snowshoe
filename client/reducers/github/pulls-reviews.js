import config from '../../../config/front';

export default function pullsReviews(state, action, user) {
  const ids = action.reviews.map((review) => review.pull_request.id);
  let login = '';

  if (user && user.login) {
    login = user.login;
  }

  return state.map((pull) => {
    const index = ids.indexOf(pull.id);

    if (index === -1) {
      return pull;
    }

    const reviews = action.reviews[index].reviews;
    const lastReviewByUsers = reviews
      // Removes review comments
     .filter((review) => review.state !== 'COMMENTED')
      // Sort reviews from most ancient to most recent
      .sort((reviewA, reviewB) => new Date(reviewA.submitted_at) - new Date(reviewB.submitted_at))
      // Only keep the last review per user
      .reduce((object, review) => {
        // eslint-disable-next-line no-param-reassign
        object[review.user.login] = review.state;

        return object;
      }, {});

    const reviewByState = Object.values(lastReviewByUsers)
      .reduce((object, review) => {
        // eslint-disable-next-line no-param-reassign
        object[review] = object[review] + 1;

        return object;
      }, {
        APPROVED: 0,
        CHANGES_REQUESTED: 0,
      });

    return Object.assign(
      {},
      pull,
      {
        mergeable: reviewByState.CHANGES_REQUESTED === 0 && reviewByState.APPROVED >= config.get('snowshow.review_required'),
        viewed: reviews.filter((review) => review.user.login === login).length > 0,
      }
    );
  });
}
