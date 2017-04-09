export default `
query viewer {
  viewer {
    login
    avatarURL
  }
}

query organizations($user_login: String!) {
  user(login:$user_login) {
    organizations(first:100) {
      edges {
        orgnization:node {
          name
          login
        }
      }
    }
  }
}

query repositories($organization_login: String!) {
  organization(login:$organization_login) {
    repositories(first:100) {
      edges {
        repository:node {
          name
        }
      }
      pageInfo {
        endCursor
        hasNextPage
      }
    }
  }
}

query repositories_paginated($organization_login: String!, $cursor: String!) {
  organization(login:$organization_login) {
    repositories(first:100, after:$cursor) {
      edges {
        repository:node {
          name
        }
      }
      pageInfo {
        endCursor
        hasNextPage
      }
    }
  }
}

query pull_requests($repository_name: String!, $organization_login: String!) {
  repository(name:$repository_name,owner:$organization_login) {
    pullRequests(first:100, states:[OPEN]) {
      edges {
        node {
          number,
          updatedAt,
          createdAt,
          title,
          author {
            avatarURL,
            login
          },
          commits(last:1) {
            edges {
              commit:node {
                status {
                  contexts {
                    context,
                    state,
                    targetURL
                  }
                }
              }
            }
          },
          labels(first:100) {
            edges {
              label:node {
                color,
                name
              }
            }
          },
          reviews(last:50,states:[APPROVED,CHANGES_REQUESTED]) {
            edges {
              review:node {
                author {
                  login
                }
                state,
              }
            }
          }
        }
      }
    }
  }
}
`;
