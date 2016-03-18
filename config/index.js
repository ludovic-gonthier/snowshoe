import path from 'path';
import dotenv from 'dotenv';

const root = `${__dirname}/../`;

dotenv.load({ path: `${root}.env` });

export const config = new Map();

process.env.NODE_ENV = process.env.NODE_ENV || 'development';

config.set('server.host', '127.0.0.1:3000');
config.set('server.port', 3000);
config.set('server.protocol', 'http');
config.set('server.secret', process.env.SERVER_SECRET);

config.set('github.client.id', process.env.GITHUB_CLIENT_ID);
config.set('github.client.secret', process.env.GITHUB_CLIENT_SECRET);

config.set('snowshoe.display_pr_title', true);
config.set('snowshoe.refresh.rate', 60000); // 60 * 1000ms: one minute
config.set('snowshoe.pulls.sort.key', 'updated_at');
config.set('snowshoe.pulls.sort.direction', 'asc');

config.set('rabbitmq.host', 'mq.snowshoe.dev');
config.set('rabbitmq.port', 5672);
config.set('rabbitmq.user', 'guest');
config.set('rabbitmq.password', process.env.RABBITMQ_PASSWORD);

config.set('redis.host', 'redis.snowshoe.dev');
config.set('redis.port', 6379);
config.set('redis.password', process.env.REDIS_PASSWORD);

config.set('root', root);
config.set('webpack.client.entry', path.resolve(root, 'client', 'modules'));
config.set('webpack.client.output', path.resolve(root, 'client', 'public'));
