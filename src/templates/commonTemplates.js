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
// src/templates/readme.template.ts
const readmeTemplate = (projectName) => `# ${projectName} (ESM)

> Professional Express.js backend scaffolded with **nxpcli** (Najim's Express CLI)  
> Fully TypeScript-based, modular, and production-ready.

---

## Table of Contents

- [Project Overview](#project-overview)  
- [Getting Started](#getting-started)  
- [Installation](#installation)  
- [Usage](#usage)  
- [Project Structure](#project-structure)  
- [Modules](#modules)  
- [Included Technologies](#included-technologies)  
- [Environment Variables](#environment-variables)  
- [Scripts](#scripts)  
- [Linting & Formatting](#linting--formatting)  
- [Git Hooks](#git-hooks)  
- [Contributing](#contributing)  
- [License](#license)  
- [Contact](#contact)  

---

## Project Overview

\`${projectName}\` is a professional Express.js backend project generated using **nxpcli**.  
It is designed for scalability, maintainability, and fast development.

Key features:

- **TypeScript First:** Full TS support for type safety.  
- **Modular Architecture:** Separate folders for modules, controllers, services, routes, and validations.  
- **Request Logging:** Automatic logging using **pino-http**.  
- **Error Handling:** Global error handler with detailed responses.  
- **Environment Ready:** Uses **dotenv** for environment configuration.  
- **Pre-configured Tools:** ESLint, Prettier, Husky, lint-staged for best practices.  

---

## Getting Started

### Prerequisites

- Node.js >= 20  
- npm >= 9  
- MongoDB database (local or cloud)

---

## Installation

Clone the repository or generate a new project with nxpcli:

\`\`\`bash
nxpcli create project ${projectName}
cd ${projectName}
npm install
\`\`\`

---

## Usage

### Development

\`\`\`bash
npm run dev
\`\`\`

Server will start on \`http://localhost:5000\` (or the port defined in \`.env\`).

### Production

\`\`\`bash
npm run build
npm start
\`\`\`

---

## Project Structure

\`\`\`
${projectName}/
├─ src/
│  ├─ modules/          # Feature modules (controller, service, route, validation)
│  ├─ middlewares/      # Global middlewares
│  ├─ utils/            # Utility functions and logger
│  ├─ config/           # Environment & configuration
│  ├─ server.ts         # Entry point
├─ .env                 # Environment variables
├─ package.json
├─ tsconfig.json
└─ README.md
\`\`\`

---

## Modules

Each module contains:

- Controller  
- Service  
- Route  
- Validation  
- (Optional) Model & TypeScript interface if \`--model\` flag is used  

Generate a new module:

\`\`\`bash
nxpcli create module <module-name> --model
\`\`\`

---

## Included Technologies

### Core Dependencies

| Package       | Description                               |
|---------------|-------------------------------------------|
| express       | Fast, minimalist web framework            |
| mongoose      | MongoDB object modeling                     |
| typescript    | Superset of JavaScript with types          |
| zod           | Schema validation with TypeScript support  |
| pino          | Fast logger for Node.js                     |
| pino-http     | HTTP request logger                         |
| cors          | Cross-origin middleware                     |
| dotenv        | Load environment variables                  |

### Development Dependencies

| Package       | Description                               |
|---------------|-------------------------------------------|
| nodemon       | Auto-restart server on file changes       |
| eslint        | Linter for JS/TS                           |
| prettier      | Code formatter                             |
| husky         | Git hooks manager                           |
| lint-staged   | Run linters on staged files                 |
| ts-node       | TypeScript execution                        |
| pino-pretty   | Pretty-print pino logs                       |

---

## Environment Variables

Create a \`.env\` file at project root:

| Variable       | Description                               | Default                                         |
|----------------|-------------------------------------------|-------------------------------------------------|
| NODE_ENV        | Environment mode                           | development                                     |
| PORT            | Server port                                | 5000                                            |
| DATABASE_URL    | MongoDB connection string                  | mongodb://127.0.0.1:27017/<your_database_name> |

---

## Scripts

| Script         | Description                               |
|----------------|-------------------------------------------|
| npm run dev    | Start server in development mode          |
| npm run build  | Compile TypeScript to JavaScript          |
| npm start      | Run production server                      |

---

## Linting & Formatting

- **ESLint:** Linting rules for TypeScript & Node.js  
- **Prettier:** Code formatting  
- Run lint: \`npm run lint\`  
- Run format: \`npm run format\`  

---

## Git Hooks

Configured with Husky & lint-staged:

- Pre-commit hooks to lint and format staged files  

---

## Contributing

If you wish to contribute:

1. Fork the repository  
2. Create a feature branch  
3. Commit your changes with clear messages  
4. Open a pull request  

---

## License

MIT License  

---

## Contact (nxpcli Developer)

> Note: The contact information below is for **nxpcli CLI developer**, not the generated project.

- **Developer:** Najim  
- **Email:** itsnajim.mail@gmail.com  
- **GitHub:** [https://github.com/najim2004](https://github.com/najim2004)
- **Portfolio:** [https://najim.vercel.app](https://najim.vercel.app)  
- **LinkedIn:** [https://linkedin.com/in/its-najim](https://linkedin.com/in/its-najim)  

---

Happy Coding! 🚀
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

const notFound = (req: Request, res: Response):void => {
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
