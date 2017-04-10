import path from 'path';
import dotenv from 'dotenv';

const root = `${__dirname}/../`;

dotenv.load({ path: `${root}.env` });

const config = new Map();

process.env.NODE_ENV = process.env.NODE_ENV || 'development';

config.set('server.host', process.env.SERVER_HOST);
config.set('server.port', process.env.SERVER_PORT);
config.set('server.protocol', process.env.SERVER_PROTOCOL);
config.set('server.secret', process.env.SERVER_SECRET);

config.set('github.client.id', process.env.GITHUB_CLIENT_ID);
config.set('github.client.secret', process.env.GITHUB_CLIENT_SECRET);

config.set('snowshoe.display_pr_title', true);
config.set('snowshoe.refresh.rate', 60000); // 60 * 1000ms: one minute
config.set('snowshoe.pulls.sort.key', 'updated_at');
config.set('snowshoe.pulls.sort.direction', 'asc');

config.set('rabbitmq.host', process.env.RABBITMQ_HOST);
config.set('rabbitmq.port', process.env.RABBITMQ_PORT);
config.set('rabbitmq.user', process.env.RABBITMQ_USER);
config.set('rabbitmq.password', process.env.RABBITMQ_PASSWORD);
config.set('rabbitmq.retry.interval', 1000); // One second interval
config.set('rabbitmq.retry.max_retry', 10);

config.set('redis.host', process.env.REDIS_HOST);
config.set('redis.port', process.env.REDIS_PORT);
config.set('redis.password', process.env.REDIS_PASSWORD);

config.set('root', root);
config.set('webpack.client.entry', path.resolve(root, 'client', 'modules'));
config.set('webpack.client.output', path.resolve(root, 'client', 'public'));

export default config;
