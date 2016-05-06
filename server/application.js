import bodyParser from 'body-parser';
import { config } from '../config';
import compress from 'compression';
import cookieParser from 'cookie-parser';
import engine from 'express-react-views';
import error from 'express-error-handler';
import express from 'express';
import http from 'http';
import morgan from 'morgan';
import session from 'express-session';
import redisStore from 'connect-redis';

import { default as passport } from './controllers/passport';
import { default as controllers } from './controllers';
import { default as listener } from './socket/listener';

const app = express();

/*
 * Application configuration
 */
app.set('view engine', 'jsx');
app.set('views', [__dirname, '../client/containers'].join('/'));
app.engine('jsx', engine.createEngine({ transformViews: false }));

app.use(morgan('dev'));

app.use(compress());
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(session({
  secret: config.get('server.secret'),
  resave: true,
  saveUninitialized: true,
  store: new (redisStore(session))({
    host: config.get('redis.host'),
    port: config.get('redis.port'),
    pass: config.get('redis.password'),
    db: 2,
  }),
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(express.static(`${__dirname}/../client/public`));
app.use(controllers);
app.use(error);

/*
 * Server configuration
 */
const server = http.createServer(app);
const socket = require('socket.io')(server);
server.on('listening', () => {
  const separator = new Array(81).join('=');

  /* eslint-disable quotes, no-console */

  console.log("%s\n", separator);
  console.log('Server launched.');
  console.log(
      "\nInformations:\n\tHostname: %s\n\tPort: %s\n",
      server.address().address,
      server.address().port
      );
  console.log(separator);

  /* eslint-enable quotes, no-console */
});

server.listen(config.get('server.port'));

/*
 * Socket configuration
 */

socket.on('connection', listener);
