const gitignoreTemplate = `# Dependencies
/node_modules
/dist

# Environment
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# Logs
logs
*.log

# IDEs and editors
.vscode
.idea
`;
const prettierrcTemplate = `{
  "singleQuote": true,
  "trailingComma": "all",
  "arrowParens": "avoid",
  "printWidth": 80
}`;
const eslintrcTemplate = `module.exports = {
  parser: '@typescript-eslint/parser',
  extends: [
    'plugin:@typescript-eslint/recommended',
    'prettier',
  ],
  plugins: ['@typescript-eslint', 'prettier'],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  rules: {
    'prettier/prettier': 'error',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
  },
};
`;
const readmeTemplate = (projectName) => `# ${projectName} (ESM)

An Express.js backend scaffolded with ncli, now updated with ES Modules.

## Running the app

\`\`\`sh
# Development
npm run dev

# Production
npm run build
npm start
\`\`\`
`;
const envTemplate = `NODE_ENV=development
PORT=5000
DATABASE_URL=mongodb://127.0.0.1:27017/express-pro-esm`;
const configIndexTemplate = `import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(process.cwd(), '.env') });

export default {
  port: process.env.PORT || 5000,
  database_url: process.env.DATABASE_URL,
  node_env: process.env.NODE_ENV || 'development',
};
`;
const notFoundTemplate = `import { Request, Response } from 'express';

const notFound = (req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: 'API Not Found: ' + req.originalUrl,
  });
};

export default notFound;
`;
const loggerTemplate = `import {pino} from 'pino';
import config from '../config/index.js';

const logger = pino(
  config.node_env === 'development'
    ? {
        transport: {
          target: 'pino-pretty',
          options: {
            colorize: true,
          },
        },
      }
    : {
      level: 'info'
    },
);

export default logger;
`;

module.exports = {
  gitignoreTemplate,
  prettierrcTemplate,
  eslintrcTemplate,
  readmeTemplate,
  envTemplate,
  configIndexTemplate,
  notFoundTemplate,
  loggerTemplate,
};