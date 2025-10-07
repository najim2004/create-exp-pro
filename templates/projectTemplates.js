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
    "prepare": "husky install"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "dependencies": {},
  "devDependencies": {},
  "lint-staged": {
    "src/**/*.ts": [
      "eslint --fix",
      "prettier --write"
    ]
  }
}`;
const tsconfigTemplate = `{
  "compilerOptions": {
    "moduleResolution": "bundler",
    "target": "es2022", // Updated to match modern ESM
    "module": "esnext", // Changed from "commonjs" to support ESM
    "rootDir": "./src",
    "outDir": "./dist",
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true, // Helps with default imports in ESM
    "forceConsistentCasingInFileNames": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true // Optional: ts-node handles emission
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
`;
const nodemonTemplate = `{
  "watch": ["src"],
  "ext": "ts",
  "exec": "node --loader ts-node/esm --experimental-specifier-resolution=node src/server.ts"
}`;
const appTsTemplate = `import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import pinoHttpMiddleware from './middlewares/requestLogger.js';

// <new-import-here>

const app: Application = express();

// Middlewares
app.use(pinoHttpMiddleware);
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
    logger.info('️ Database connected successfully');

    // Add final middlewares
    app.use(globalErrorHandler);
    app.use(notFound);

    // Start server
    app.listen(config.port, () => {
      logger.info(' Server listening on port ' + config.port);
    });

  } catch (err) {
    logger.error(' Failed to bootstrap application', err);
    process.exit(1);
  }
}

bootstrap();
`;
const globalErrorHandlerTemplate = `import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import config from '../config/index.js';
import { TErrorSources } from '../interface/error.js';

// Helper for sending error response
const sendErrorResponse = (res: Response, statusCode: number, message: string, errorSources: TErrorSources, stack?: string) => {
  return res.status(statusCode).json({ success: false, message, errorSources, stack });
};

// Zod error
const handleZodError = (err: ZodError) => ({
  statusCode: 400,
  message: 'Validation Error',
  errorSources: err.issues.map(i => ({ path: i.path.join('.') || '', message: i.message })),
});

// Mongoose ValidationError
const handleMongooseValidationError = (err: { errors: Record<string, { path: string; message: string }> }) => ({
  statusCode: 400,
  message: 'Validation Error',
  errorSources: Object.values(err.errors).map(val => ({ path: val.path, message: val.message })),
});

// Mongoose CastError
const handleMongooseCastError = (err: { path: string; message: string }) => ({
  statusCode: 400,
  message: 'Invalid ID',
  errorSources: [{ path: err.path, message: err.message }],
});

// Mongoose Duplicate Key
const handleMongooseDuplicateError = (err: { keyValue: Record<string, unknown> }) => {
  const key = Object.keys(err.keyValue)[0];
  return {
    statusCode: 400,
    message: \`\${key} already exists\`,
    errorSources: [{ path: key, message: \`\${key} already exists\` }],
  };
};

// Global Error Handler
const globalErrorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  let statusCode = 500;
  let message = 'Something went wrong!';
  let errorSources: TErrorSources = [{ path: '', message }];

  if (err instanceof ZodError) {
    const e = handleZodError(err);
    statusCode = e.statusCode;
    message = e.message;
    errorSources = e.errorSources;
  } else if (err?.name === 'ValidationError') {
    const e = handleMongooseValidationError(err);
    statusCode = e.statusCode;
    message = e.message;
    errorSources = e.errorSources;
  } else if (err?.name === 'CastError') {
    const e = handleMongooseCastError(err);
    statusCode = e.statusCode;
    message = e.message;
    errorSources = e.errorSources;
  } else if (err?.code === 11000 && err?.keyValue) {
    const e = handleMongooseDuplicateError(err);
    statusCode = e.statusCode;
    message = e.message;
    errorSources = e.errorSources;
  }

  return sendErrorResponse(
    res,
    statusCode,
    message,
    errorSources,
    config.node_env === 'development' ? err?.stack : undefined
  );
};

export default globalErrorHandler;

`;
const validateRequestTemplate = `// src/middlewares/validateRequest.ts
import { Request, Response, NextFunction, RequestHandler } from 'express';
import { ZodTypeAny } from 'zod';

const validateRequest =
  <T extends ZodTypeAny>(schema: T): RequestHandler =>
  (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse({
      body: req.body,
      query: req.query,
      params: req.params,
    });

    if (!result.success) {
      const errors = result.error.issues.map(i => ({
        field: i.path.join('.'),
        message: i.message,
      }));
      return res.status(400).json({ success: false, errors });
    }

    // optional: overwrite parsed, type-safe data back to req
    Object.assign(req, result.data);
    next();
  };

export default validateRequest;

`;
const errorInterfaceTemplate = `export type TErrorSources = {
  path: string | number;
  message: string;
}[];
`;
module.exports = {
  getPackageJsonTemplate,
  tsconfigTemplate,
  nodemonTemplate,
  appTsTemplate,
  serverTsTemplate,
  globalErrorHandlerTemplate,
  validateRequestTemplate,
  errorInterfaceTemplate,
};
