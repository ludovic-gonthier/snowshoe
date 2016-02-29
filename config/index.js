import path from 'path';
import dotenv from 'dotenv';

const root = `${__dirname}/../`;

dotenv.load({ path: `${root}.env` });

export const config = new Map();

config.set('server.host', process.env.SERVER_HOST || '127.0.0.1:3000');
config.set('server.port', process.env.SERVER_PORT || 3000);
config.set('server.protocol', process.env.SEVER_PROTOCOL || 'http');
config.set('server.secret', process.env.SERVER_SECRET || 'this is not a secret');

config.set('github.client.id', process.env.GITHUB_CLIENT_ID);
config.set('github.client.secret', process.env.GITHUB_CLIENT_SECRET);

config.set('snowshoe.display_pr_title', false);
// 60 * 1000ms: one minute
config.set('snowshoe.refresh.rate', process.env.SNOWSHOE_REFRESH_RATE || 60000);

config.set('root', root);
config.set('webpack.client.entry', path.resolve(root, 'client', 'modules'));
config.set('webpack.client.output', path.resolve(root, 'client', 'public'));
