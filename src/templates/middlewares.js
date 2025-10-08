const requestLoggerTemplate = String.raw`import pinoHttp from 'pino-http';
import logger from '../utils/logger';
import config from '../config/index';
import { IncomingMessage, ServerResponse } from 'http';

const pinoHttpMiddleware = pinoHttp({
  logger,
  // Use pino-pretty in development
  ...(config.node_env === 'development' && {
    transport: {
      target: 'pino-pretty',
      options: {
        colorize: true,
        levelFirst: true,
        translateTime: 'SYS:standard',
      },
    },
  }),
  // Define a custom success message
  customSuccessMessage: function (req: IncomingMessage, res: ServerResponse) {
    if (res.statusCode === 404) {
      return 'Resource not found';
    }
    return \`\${req.method} \${req.url} completed\`;
  },
  // Define a custom error message
  customErrorMessage: function (req: IncomingMessage,) {
    return \`Request failed: \${req.method} \${req.url}\`;
  },
});

export default pinoHttpMiddleware;
`;

module.exports = {
  requestLoggerTemplate,
};
