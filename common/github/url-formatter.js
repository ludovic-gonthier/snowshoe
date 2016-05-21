import _ from 'lodash';
import { format, parse } from 'url';
import querystring from 'querystring';

const GITHUB_BASE_URL = 'https://api.github.com';
const regexp = {
  number: /\{\/number\}/,
  sha: /\{\/sha\}/,
  slash: /^\//,
};

export default function (url, options) {
  let formatted = url;

  if (url.indexOf('http') === -1) {
    formatted = [
      GITHUB_BASE_URL,
      url.replace(regexp.slash, ''),
    ].join('/');
  }

  formatted = formatted.replace(regexp.number, '')
    .replace(regexp.sha, '');

  const parsed = parse(formatted);

  return format({
    protocol: parsed.protocol,
    hostname: parsed.hostname,
    pathname: parsed.pathname,
    query: _.assign({}, querystring.parse(parsed.query), _.pick(options, 'per_page')),
  });
}
