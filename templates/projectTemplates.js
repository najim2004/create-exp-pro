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
}`;const tsconfigTemplate = `{
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
}`;const nodemonTemplate = `{
  "watch": ["src"],
  "ext": "ts",
  "exec": "ts-node-esm ./src/server.ts"
}`;const appTsTemplate = `import express, { Application, Request, Response } from 'express';
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
`;const serverTsTemplate = `import mongoose from 'mongoose';
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
`;const globalErrorHandlerTemplate = `import { Request, Response, NextFunction } from 'express';
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
`;const validateRequestTemplate = `import { NextFunction, Request, Response } from 'express';
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
`;const errorInterfaceTemplate = `export type TErrorSources = {
  path: string | number;
  message: string;
}[];
`;module.exports = {
  getPackageJsonTemplate,
  tsconfigTemplate,
  nodemonTemplate,
  appTsTemplate,
  serverTsTemplate,
  globalErrorHandlerTemplate,
  validateRequestTemplate,
  errorInterfaceTemplate,
};