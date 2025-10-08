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
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 100,
  "tabWidth": 2,
  "useTabs": false,
  "endOfLine": "lf",
  "bracketSpacing": true,
  "arrowParens": "avoid"
}`;
const eslintrcTemplate = `import tseslint from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import eslintConfigPrettier from 'eslint-config-prettier';
import { defineConfig } from 'eslint/config';

export default defineConfig([
  eslintConfigPrettier,
  {
    files: ['**/*.ts'],
    extends: ['@typescript-eslint/recommended', '@typescript-eslint/stylistic'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: './tsconfig.json',
      },
    },
    plugins: {
      '@typescript-eslint': tseslint,
    },
    rules: {
      // Add any custom rules or overrides here
      '@typescript-eslint/explicit-function-return-type': 'warn',
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
        },
      ],
      'no-console': 'warn',
      'no-debugger': 'warn',
      'no-duplicate-imports': 'error',
      'no-unused-vars': 'off',
    },
  },
  {
    ignores: ['dist/**', 'node_modules/**'],
  },
]);

`;
const readmeTemplate = (projectName) => `# ${projectName} (ESM)

An Express.js backend scaffolded with nxpcli, now updated with ES Modules.

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
DATABASE_URL=mongodb://127.0.0.1:27017/<your_database_name>`;
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
import config from '../config/index';

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
