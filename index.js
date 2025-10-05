#!/usr/bin/env node

const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

// --- Template Functions (ESM Version) ---

const getPackageJsonTemplate = (projectName) => `{
  "name": "${projectName}",
  "version": "1.0.0",
  "description": "A professional Express.js backend scaffolded with create-express-pro",
  "main": "dist/server.js",
  "type": "module",
  "scripts": {
    "start": "node dist/server.js",
    "dev": "nodemon",
    "build": "tsc",
    "lint": "eslint src --ext ts --fix",
    "prettier": "prettier --write src/**/*.ts",
    "prepare": "husky install",
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "dependencies": {
    "cors": "^2.8.5",
    "dotenv": "^17.2.3",
    "express": "^5.1.0",
    "mongoose": "^8.19.0",
    "pino": "^10.0.0",
    "pino-pretty": "^10.2.3",
    "zod": "^4.1.11"
  },
  "devDependencies": {
    "@types/cors": "^2.8.16",
    "@types/express": "^4.17.21",
    "@types/node": "^24.6.2",
    "@typescript-eslint/eslint-plugin": "^6.11.0",
    "@typescript-eslint/parser": "^6.11.0",
    "eslint": "^9.37.0",
    "eslint-config-prettier": "^9.0.0",
    "eslint-plugin-prettier": "^5.0.1",
    "husky": "^9.1.7",
    "lint-staged": "^15.1.0",
    "nodemon": "^3.1.10",
    "prettier": "^3.6.2",
    "ts-node": "^10.9.1",
    "typescript": "^5.9.3"
  },
  "lint-staged": {
    "src/**/*.ts": [
      "eslint --fix",
      "prettier --write"
    ]
  }
}`;

const tsconfigTemplate = `{
  "compilerOptions": {
    "target": "ES2022",
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "rootDir": "./src",
    "outDir": "./dist",
    "esModuleInterop": true,
    "forceConsistentCasingInFileNames": true,
    "strict": true,
    "skipLibCheck": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    }
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules"]
}`;

const nodemonTemplate = `{
  "watch": ["src"],
  "ext": "ts",
  "exec": "ts-node-esm ./src/server.ts"
}`;

const appTsTemplate = `import express, { Application, Request, Response } from 'express';
import cors from 'cors';

// <new-import-here>

const app: Application = express();

// Middlewares
app.use(express.json());
app.use(cors({
  origin: '*', // configure as needed
  credentials: true,
}));

// <new-route-here>

// Health check route
app.get('/', (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: 'Welcome to the Express Pro server! (ESM Edition)',
  });
});

export default app;
`;

const serverTsTemplate = `import mongoose from 'mongoose';
import app from './app.js';
import config from './config/index.js';
import logger from './utils/logger.js';
import globalErrorHandler from './middlewares/globalErrorHandler.js';
import notFound from './middlewares/notFound.js';

async function bootstrap() {
  try {
    // Connect to DB
    await mongoose.connect(config.database_url as string);
    logger.info('🛢️ Database connected successfully');

    // Add final middlewares
    app.use(globalErrorHandler);
    app.use(notFound);

    // Start server
    app.listen(config.port, () => {
      logger.info('🚀 Server listening on port ' + config.port);
    });

  } catch (err) {
    logger.error('🔥 Failed to bootstrap application', err);
    process.exit(1);
  }
}

bootstrap();
`;

const globalErrorHandlerTemplate = `import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import config from '../config/index.js';
import { TErrorSources } from '../interface/error.js';

const handleZodError = (err: ZodError) => {
  const errorSources: TErrorSources = err.issues.map((issue) => {
    return {
      path: issue.path[issue.path.length - 1],
      message: issue.message,
    };
  });
  return {
    statusCode: 400,
    message: 'Validation Error',
    errorSources,
  };
};

const handleMongooseValidationError = (err: any) => {
  const errorSources: TErrorSources = Object.values(err.errors).map((val: any) => {
    return {
      path: val?.path,
      message: val?.message,
    };
  });
  return {
    statusCode: 400,
    message: 'Validation Error',
    errorSources,
  };
};

const handleMongooseCastError = (err: any) => {
  return {
    statusCode: 400,
    message: 'Invalid ID',
    errorSources: [{
      path: err.path,
      message: err.message,
    }],
  };
};

const handleMongooseDuplicateError = (err: any) => {
  const match = err.message.match(/"([^"]*)"/);
  const extractedMessage = match && match[1];
  return {
    statusCode: 400,
    message: extractedMessage + ' is already exists',
    errorSources: [{
      path: '',
      message: extractedMessage + ' is already exists',
    }],
  };
};


const globalErrorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Something went wrong!';
  let errorSources: TErrorSources = [{ path: '', message: 'Something went wrong' }];

  if (err instanceof ZodError) {
    const simplifiedError = handleZodError(err);
    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message;
    errorSources = simplifiedError.errorSources;
  } else if (err?.name === 'ValidationError') {
    const simplifiedError = handleMongooseValidationError(err);
    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message;
    errorSources = simplifiedError.errorSources;
  } else if (err?.name === 'CastError') {
    const simplifiedError = handleMongooseCastError(err);
    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message;
    errorSources = simplifiedError.errorSources;
  } else if (err?.code === 11000) {
    const simplifiedError = handleMongooseDuplicateError(err);
    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message;
    errorSources = simplifiedError.errorSources;
  }


  return res.status(statusCode).json({
    success: false,
    message,
    errorSources,
    stack: config.node_env === 'development' ? err?.stack : undefined,
  });
};

export default globalErrorHandler;
`;

const validateRequestTemplate = `import { NextFunction, Request, Response } from 'express';
import { AnyZodObject } from 'zod';

const validateRequest = (schema: AnyZodObject) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
        cookies: req.cookies,
      });
      return next();
    } catch (error) {
      next(error);
    }
  };
};

export default validateRequest;
`;

const errorInterfaceTemplate = `export type TErrorSources = {
  path: string | number;
  message: string;
}[];
`;

const getModuleRouteTemplate = (moduleName) => {
  const capitalized = capitalize(moduleName);
  return `import { Router } from 'express';
import { ${capitalized}Controllers } from './${moduleName}.controller.js';
import validateRequest from '../../middlewares/validateRequest.js';
import { ${capitalized}Validations } from './${moduleName}.validation.js';

const router = Router();

router.post(
  '/',
  validateRequest(${capitalized}Validations.create${capitalized}ValidationSchema),
  ${capitalized}Controllers.create${capitalized},
);

router.get('/', ${capitalized}Controllers.getAll${capitalized}s);

router.get('/:id', ${capitalized}Controllers.getSingle${capitalized});

router.patch(
  '/:id',
  validateRequest(${capitalized}Validations.update${capitalized}ValidationSchema),
  ${capitalized}Controllers.update${capitalized},
);

router.delete('/:id', ${capitalized}Controllers.delete${capitalized});

export const ${moduleName}Routes = router;
`;
};

const getModuleControllerTemplate = (moduleName) => {
  const capitalized = capitalize(moduleName);
  return `import { Request, Response, NextFunction } from 'express';
import { ${capitalized}Services } from './${moduleName}.service.js';

const create${capitalized} = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await ${capitalized}Services.create${capitalized}IntoDB(req.body);
    res.status(201).json({
      success: true,
      message: '${capitalized} created successfully!',
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

const getAll${capitalized}s = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await ${capitalized}Services.getAll${capitalized}sFromDB();
    res.status(200).json({
      success: true,
      message: '${capitalized}s retrieved successfully!',
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

const getSingle${capitalized} = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const result = await ${capitalized}Services.getSingle${capitalized}FromDB(id);
    res.status(200).json({
      success: true,
      message: '${capitalized} retrieved successfully!',
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

const update${capitalized} = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const result = await ${capitalized}Services.update${capitalized}IntoDB(id, req.body);
    res.status(200).json({
      success: true,
      message: '${capitalized} updated successfully!',
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

const delete${capitalized} = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    await ${capitalized}Services.delete${capitalized}FromDB(id);
    res.status(200).json({
      success: true,
      message: '${capitalized} deleted successfully!',
      data: null,
    });
  } catch (err) {
    next(err);
  }
};

export const ${capitalized}Controllers = {
  create${capitalized},
  getAll${capitalized}s,
  getSingle${capitalized},
  update${capitalized},
  delete${capitalized},
};
`;
};

const getModuleServiceTemplate = (moduleName, hasModel) => {
  const capitalized = capitalize(moduleName);
  if (hasModel) {
    return `import { T${capitalized} } from './${moduleName}.interface.js';
import { ${capitalized} } from './${moduleName}.model.js';

const create${capitalized}IntoDB = async (payload: T${capitalized}) => {
  const result = await ${capitalized}.create(payload);
  return result;
};

const getAll${capitalized}sFromDB = async () => {
  const result = await ${capitalized}.find();
  return result;
};

const getSingle${capitalized}FromDB = async (id: string) => {
  const result = await ${capitalized}.findById(id);
  return result;
};

const update${capitalized}IntoDB = async (id: string, payload: Partial<T${capitalized}>) => {
  const result = await ${capitalized}.findByIdAndUpdate(id, payload, { new: true, runValidators: true });
  return result;
};

const delete${capitalized}FromDB = async (id: string) => {
  const result = await ${capitalized}.findByIdAndDelete(id);
  return result;
};

export const ${capitalized}Services = {
  create${capitalized}IntoDB,
  getAll${capitalized}sFromDB,
  getSingle${capitalized}FromDB,
  update${capitalized}IntoDB,
  delete${capitalized}FromDB,
};
`;
  }
  return `// Dummy service for ${moduleName}
const create${capitalized}IntoDB = async (payload: Record<string, any>) => {
  console.log('Dummy service: creating ${moduleName} with payload', payload);
  return payload;
};
const getAll${capitalized}sFromDB = async () => { return []; };
const getSingle${capitalized}FromDB = async (id: string) => { return { id }; };
const update${capitalized}IntoDB = async (id: string, payload: Record<string, any>) => { return { id, ...payload }; };
const delete${capitalized}FromDB = async (id: string) => { return { id }; };

export const ${capitalized}Services = {
  create${capitalized}IntoDB,
  getAll${capitalized}sFromDB,
  getSingle${capitalized}FromDB,
  update${capitalized}IntoDB,
  delete${capitalized}FromDB,
};
`;
};

const getModuleValidationTemplate = (moduleName) => {
  const capitalized = capitalize(moduleName);
  return `import { z } from 'zod';

const create${capitalized}ValidationSchema = z.object({
  body: z.object({
    name: z.string({ required_error: 'Name is required' }),
    // Add more fields for your ${moduleName}
  }),
});

const update${capitalized}ValidationSchema = create${capitalized}ValidationSchema.deepPartial();

export const ${capitalized}Validations = {
  create${capitalized}ValidationSchema,
  update${capitalized}ValidationSchema,
};
`;
};

// --- Other templates (unchanged from CJS version but needed) ---
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

An Express.js backend scaffolded with create-express-pro, now updated with ES Modules.

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
const getModuleModelTemplate = (moduleName) => {
  const capitalized = capitalize(moduleName);
  return `import { Schema, model } from 'mongoose';
import { T${capitalized} } from './${moduleName}.interface.js';

const ${moduleName}Schema = new Schema<T${capitalized}>({
  name: {
    type: String,
    required: true,
    unique: true,
  },
}, {
  timestamps: true,
});

export const ${capitalized} = model<T${capitalized}>('${capitalized}', ${moduleName}Schema);
`;
};
const getModuleInterfaceTemplate = (moduleName) => {
  const capitalized = capitalize(moduleName);
  return `export type T${capitalized} = {
  name: string;
};
`;
};

// --- CLI Logic ---

const capitalize = (s) => s.charAt(0).toUpperCase() + s.slice(1);

const main = () => {
  const args = process.argv.slice(2);
  const command = args[0];

  if (command === "new") {
    const projectName = args[1];
    if (!projectName) {
      console.error(
        "Error: Project name is required. Usage: create-express-pro new <project-name>"
      );
      process.exit(1);
    }
    scaffoldNewProject(projectName);
  } else if (command === "module") {
    const moduleName = args[1];
    const hasModel = args.includes("--model");
    if (!moduleName) {
      console.error(
        "Error: Module name is required. Usage: create-express-pro module <name> [--model]"
      );
      process.exit(1);
    }
    generateModule(moduleName.toLowerCase(), hasModel);
  } else {
    console.log("Welcome to create-express-pro (ESM Edition)!");
    console.log("Usage:");
    console.log(
      "  create-express-pro new <project-name>   - Scaffold a new Express.js project"
    );
    console.log(
      "  create-express-pro module <name> [--model] - Generate a new module"
    );
  }
};

const scaffoldNewProject = (projectName) => {
  console.log(`\nScaffolding new ESM project: ${projectName}...\n`);
  const projectPath = path.join(process.cwd(), projectName);

  if (fs.existsSync(projectPath)) {
    console.error(`Error: Directory ${projectName} already exists.`);
    process.exit(1);
  }

  fs.mkdirSync(projectPath, { recursive: true });

  const dirs = [
    "src/config",
    "src/middlewares",
    "src/modules",
    "src/utils",
    "src/interface",
  ];
  dirs.forEach((dir) =>
    fs.mkdirSync(path.join(projectPath, dir), { recursive: true })
  );

  const files = [
    { name: "package.json", content: getPackageJsonTemplate(projectName) },
    { name: "tsconfig.json", content: tsconfigTemplate },
    { name: "nodemon.json", content: nodemonTemplate },
    { name: ".gitignore", content: gitignoreTemplate },
    { name: ".eslintrc.js", content: eslintrcTemplate },
    { name: ".prettierrc", content: prettierrcTemplate },
    { name: "README.md", content: readmeTemplate(projectName) },
    { name: ".env", content: envTemplate },
    { name: "src/app.ts", content: appTsTemplate },
    { name: "src/server.ts", content: serverTsTemplate },
    { name: "src/config/index.ts", content: configIndexTemplate },
    {
      name: "src/middlewares/globalErrorHandler.ts",
      content: globalErrorHandlerTemplate,
    },
    { name: "src/middlewares/notFound.ts", content: notFoundTemplate },
    {
      name: "src/middlewares/validateRequest.ts",
      content: validateRequestTemplate,
    },
    { name: "src/utils/logger.ts", content: loggerTemplate },
    { name: "src/interface/error.ts", content: errorInterfaceTemplate },
  ];

  files.forEach((file) => {
    fs.writeFileSync(path.join(projectPath, file.name), file.content);
    console.log(`✅ Created ${file.name}`);
  });

  console.log("\nInstalling dependencies... This might take a few minutes.\n");
  try {
    execSync(`cd "${projectPath}" && npm install`, { stdio: "inherit" });
  } catch (error) {
    console.error(
      '\nFailed to install dependencies. Please run "npm install" manually.'
    );
    process.exit(1);
  }

  console.log("\nInitializing Husky...\n");
  try {
    execSync(`cd "${projectPath}" && npm run prepare`, { stdio: "inherit" });
  } catch (error) {
    console.error(
      '\nFailed to initialize Husky. You may need to run "npm run prepare" manually.'
    );
  }

  console.log(`\n✅ Project '${projectName}' created successfully!`);
  console.log(`\nTo get started:\n`);
  console.log(`  cd ${projectName}`);
  console.log(`  npm run dev\n`);
};

const generateModule = (moduleName, hasModel) => {
  console.log(`\nGenerating ESM module: ${moduleName}...\n`);
  const modulePath = path.join(process.cwd(), "src", "modules", moduleName);

  if (!fs.existsSync(path.join(process.cwd(), "src", "app.ts"))) {
    console.error("Error: This command must be run from project root.");
    process.exit(1);
  }

  if (fs.existsSync(modulePath)) {
    console.error(`Error: Module '${moduleName}' already exists.`);
    process.exit(1);
  }

  fs.mkdirSync(modulePath, { recursive: true });

  // --- create module files ---
  const filesToCreate = [
    {
      name: `${moduleName}.route.ts`,
      content: getModuleRouteTemplate(moduleName),
    },
    {
      name: `${moduleName}.controller.ts`,
      content: getModuleControllerTemplate(moduleName),
    },
    {
      name: `${moduleName}.validation.ts`,
      content: getModuleValidationTemplate(moduleName),
    },
    {
      name: `${moduleName}.service.ts`,
      content: getModuleServiceTemplate(moduleName, hasModel),
    },
  ];

  if (hasModel) {
    filesToCreate.push({
      name: `${moduleName}.model.ts`,
      content: getModuleModelTemplate(moduleName),
    });
    filesToCreate.push({
      name: `${moduleName}.interface.ts`,
      content: getModuleInterfaceTemplate(moduleName),
    });
  }

  filesToCreate.forEach((file) => {
    fs.writeFileSync(path.join(modulePath, file.name), file.content);
    console.log(`✅ Created ${file.name}`);
  });

  // --- Update app.ts for automatic module injection ---
  const appTsPath = path.join(process.cwd(), 'src', 'app.ts');
  let appContent = fs.readFileSync(appTsPath, 'utf-8');

  const routeName = `${moduleName}Routes`;
  const importLine = `import { ${routeName} } from './modules/${moduleName}/${moduleName}.route.js';`;
  const useLine = `app.use('/api/v1/${moduleName}', ${routeName});`;
  const importMarker = '// <new-import-here>';
  const routeMarker = '// <new-route-here>';

  if (appContent.includes(importLine)) {
    console.log(`✅ Module '${moduleName}' already injected. Skipping.`);
  } else {
    appContent = appContent.replace(importMarker, `${importLine}
${importMarker}`);
    appContent = appContent.replace(routeMarker, `${useLine}
${routeMarker}`);
    fs.writeFileSync(appTsPath, appContent);
    console.log(`✅ Injected module '${moduleName}' into app.ts`);
  }

  console.log(`
✅ Module '${moduleName}' created successfully!`);
};

main();
