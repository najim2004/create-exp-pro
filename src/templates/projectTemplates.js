const getPackageJsonTemplate = (projectName) => `{
  "name": "${projectName}",
  "version": "1.0.0",
  "description": "A professional Express.js backend scaffolded with create-express-pro",
  "main": "eslint.config.mjs",
  "type": "commonjs",
  "scripts": {
    "start": "node dist/server.js",
    "dev": "nodemon",
    "build": "tsc",
    "lint": "eslint src --ext ts --fix",
    "format": "prettier --write src/**/*.ts",
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
    /* Visit https://aka.ms/tsconfig to read more about this file */

    /* Projects */
    // "incremental": true,                              /* Save .tsbuildinfo files to allow for incremental compilation of projects. */
    // "composite": true,                                /* Enable constraints that allow a TypeScript project to be used with project references. */
    // "tsBuildInfoFile": "./.tsbuildinfo",              /* Specify the path to .tsbuildinfo incremental compilation file. */
    // "disableSourceOfProjectReferenceRedirect": true,  /* Disable preferring source files instead of declaration files when referencing composite projects. */
    // "disableSolutionSearching": true,                 /* Opt a project out of multi-project reference checking when editing. */
    // "disableReferencedProjectLoad": true,             /* Reduce the number of projects loaded automatically by TypeScript. */

    /* Language and Environment */
    "target": "es2020" /* Set the JavaScript language version for emitted JavaScript and include compatible library declarations. */,
    // "lib": [],                                        /* Specify a set of bundled library declaration files that describe the target runtime environment. */
    // "jsx": "preserve",                                /* Specify what JSX code is generated. */
    // "libReplacement": true,                           /* Enable lib replacement. */
    // "experimentalDecorators": true,                   /* Enable experimental support for legacy experimental decorators. */
    // "emitDecoratorMetadata": true,                    /* Emit design-type metadata for decorated declarations in source files. */
    // "jsxFactory": "",                                 /* Specify the JSX factory function used when targeting React JSX emit, e.g. 'React.createElement' or 'h'. */
    // "jsxFragmentFactory": "",                         /* Specify the JSX Fragment reference used for fragments when targeting React JSX emit e.g. 'React.Fragment' or 'Fragment'. */
    // "jsxImportSource": "",                            /* Specify module specifier used to import the JSX factory functions when using 'jsx: react-jsx*'. */
    // "reactNamespace": "",                             /* Specify the object invoked for 'createElement'. This only applies when targeting 'react' JSX emit. */
    // "noLib": true,                                    /* Disable including any library files, including the default lib.d.ts. */
    // "useDefineForClassFields": true,                  /* Emit ECMAScript-standard-compliant class fields. */
    // "moduleDetection": "auto",                        /* Control what method is used to detect module-format JS files. */

    /* Modules */
    "module": "commonjs" /* Specify what module code is generated. */,
    "rootDir": "./src" /* Specify the root folder within your source files. */,
    // "moduleResolution": "node10",                     /* Specify how TypeScript looks up a file from a given module specifier. */
    // "baseUrl": "./",                                  /* Specify the base directory to resolve non-relative module names. */
    // "paths": {},                                      /* Specify a set of entries that re-map imports to additional lookup locations. */
    // "rootDirs": [],                                   /* Allow multiple folders to be treated as one when resolving modules. */
    // "typeRoots": [],                                  /* Specify multiple folders that act like './node_modules/@types'. */
    // "types": [],                                      /* Specify type package names to be included without being referenced in a source file. */
    // "allowUmdGlobalAccess": true,                     /* Allow accessing UMD globals from modules. */
    // "moduleSuffixes": [],                             /* List of file name suffixes to search when resolving a module. */
    // "allowImportingTsExtensions": true,               /* Allow imports to include TypeScript file extensions. Requires '--moduleResolution bundler' and either '--noEmit' or '--emitDeclarationOnly' to be set. */
    // "rewriteRelativeImportExtensions": true,          /* Rewrite '.ts', '.tsx', '.mts', and '.cts' file extensions in relative import paths to their JavaScript equivalent in output files. */
    // "resolvePackageJsonExports": true,                /* Use the package.json 'exports' field when resolving package imports. */
    // "resolvePackageJsonImports": true,                /* Use the package.json 'imports' field when resolving imports. */
    // "customConditions": [],                           /* Conditions to set in addition to the resolver-specific defaults when resolving imports. */
    // "noUncheckedSideEffectImports": true,             /* Check side effect imports. */
    // "resolveJsonModule": true,                        /* Enable importing .json files. */
    // "allowArbitraryExtensions": true,                 /* Enable importing files with any extension, provided a declaration file is present. */
    // "noResolve": true,                                /* Disallow 'import's, 'require's or '<reference>'s from expanding the number of files TypeScript should add to a project. */

    /* JavaScript Support */
    // "allowJs": true,                                  /* Allow JavaScript files to be a part of your program. Use the 'checkJS' option to get errors from these files. */
    // "checkJs": true,                                  /* Enable error reporting in type-checked JavaScript files. */
    // "maxNodeModuleJsDepth": 1,                        /* Specify the maximum folder depth used for checking JavaScript files from 'node_modules'. Only applicable with 'allowJs'. */

    /* Emit */
    // "declaration": true,                              /* Generate .d.ts files from TypeScript and JavaScript files in your project. */
    // "declarationMap": true,                           /* Create sourcemaps for d.ts files. */
    // "emitDeclarationOnly": true,                      /* Only output d.ts files and not JavaScript files. */
    // "sourceMap": true,                                /* Create source map files for emitted JavaScript files. */
    // "inlineSourceMap": true,                          /* Include sourcemap files inside the emitted JavaScript. */
    // "noEmit": true,                                   /* Disable emitting files from a compilation. */
    // "outFile": "./",                                  /* Specify a file that bundles all outputs into one JavaScript file. If 'declaration' is true, also designates a file that bundles all .d.ts output. */
    "outDir": "./dist" /* Specify an output folder for all emitted files. */,
    // "removeComments": true,                           /* Disable emitting comments. */
    // "importHelpers": true,                            /* Allow importing helper functions from tslib once per project, instead of including them per-file. */
    // "downlevelIteration": true,                       /* Emit more compliant, but verbose and less performant JavaScript for iteration. */
    // "sourceRoot": "",                                 /* Specify the root path for debuggers to find the reference source code. */
    // "mapRoot": "",                                    /* Specify the location where debugger should locate map files instead of generated locations. */
    // "inlineSources": true,                            /* Include source code in the sourcemaps inside the emitted JavaScript. */
    // "emitBOM": true,                                  /* Emit a UTF-8 Byte Order Mark (BOM) in the beginning of output files. */
    // "newLine": "crlf",                                /* Set the newline character for emitting files. */
    // "stripInternal": true,                            /* Disable emitting declarations that have '@internal' in their JSDoc comments. */
    // "noEmitHelpers": true,                            /* Disable generating custom helper functions like '__extends' in compiled output. */
    // "noEmitOnError": true,                            /* Disable emitting files if any type checking errors are reported. */
    // "preserveConstEnums": true,                       /* Disable erasing 'const enum' declarations in generated code. */
    // "declarationDir": "./",                           /* Specify the output directory for generated declaration files. */

    /* Interop Constraints */
    // "isolatedModules": true,                          /* Ensure that each file can be safely transpiled without relying on other imports. */
    // "verbatimModuleSyntax": true,                     /* Do not transform or elide any imports or exports not marked as type-only, ensuring they are written in the output file's format based on the 'module' setting. */
    // "isolatedDeclarations": true,                     /* Require sufficient annotation on exports so other tools can trivially generate declaration files. */
    // "erasableSyntaxOnly": true,                       /* Do not allow runtime constructs that are not part of ECMAScript. */
    // "allowSyntheticDefaultImports": true,             /* Allow 'import x from y' when a module doesn't have a default export. */
    "esModuleInterop": true /* Emit additional JavaScript to ease support for importing CommonJS modules. This enables 'allowSyntheticDefaultImports' for type compatibility. */,
    // "preserveSymlinks": true,                         /* Disable resolving symlinks to their realpath. This correlates to the same flag in node. */
    "forceConsistentCasingInFileNames": true /* Ensure that casing is correct in imports. */,

    /* Type Checking */
    "strict": true /* Enable all strict type-checking options. */,
    // "noImplicitAny": true,                            /* Enable error reporting for expressions and declarations with an implied 'any' type. */
    // "strictNullChecks": true,                         /* When type checking, take into account 'null' and 'undefined'. */
    // "strictFunctionTypes": true,                      /* When assigning functions, check to ensure parameters and the return values are subtype-compatible. */
    // "strictBindCallApply": true,                      /* Check that the arguments for 'bind', 'call', and 'apply' methods match the original function. */
    // "strictPropertyInitialization": true,             /* Check for class properties that are declared but not set in the constructor. */
    // "strictBuiltinIteratorReturn": true,              /* Built-in iterators are instantiated with a 'TReturn' type of 'undefined' instead of 'any'. */
    // "noImplicitThis": true,                           /* Enable error reporting when 'this' is given the type 'any'. */
    // "useUnknownInCatchVariables": true,               /* Default catch clause variables as 'unknown' instead of 'any'. */
    // "alwaysStrict": true,                             /* Ensure 'use strict' is always emitted. */
    // "noUnusedLocals": true,                           /* Enable error reporting when local variables aren't read. */
    // "noUnusedParameters": true,                       /* Raise an error when a function parameter isn't read. */
    // "exactOptionalPropertyTypes": true,               /* Interpret optional property types as written, rather than adding 'undefined'. */
    // "noImplicitReturns": true,                        /* Enable error reporting for codepaths that do not explicitly return in a function. */
    // "noFallthroughCasesInSwitch": true,               /* Enable error reporting for fallthrough cases in switch statements. */
    // "noUncheckedIndexedAccess": true,                 /* Add 'undefined' to a type when accessed using an index. */
    // "noImplicitOverride": true,                       /* Ensure overriding members in derived classes are marked with an override modifier. */
    // "noPropertyAccessFromIndexSignature": true,       /* Enforces using indexed accessors for keys declared using an indexed type. */
    // "allowUnusedLabels": true,                        /* Disable error reporting for unused labels. */
    // "allowUnreachableCode": true,                     /* Disable error reporting for unreachable code. */

    /* Completeness */
    // "skipDefaultLibCheck": true,                      /* Skip type checking .d.ts files that are included with TypeScript. */
    "skipLibCheck": false /* Skip type checking all .d.ts files. */
  },

  "include": ["src/**/*"],
  "exclude": ["node_modules"]
}

`;
const nodemonTemplate = `{
  "watch": ["src"],
  "ext": "ts",
  "exec": "nodemon --exec ts-node src/server.ts"
}
`;
const appTsTemplate = `import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import pinoHttpMiddleware from './middlewares/requestLogger';

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
app.get('/', (req: Request, res: Response):void => {
  res.status(200).json({
    success: true,
    message: 'Welcome to the Express Pro server! (ESM Edition)',
  });
});

export default app;
`;
const serverTsTemplate = `import mongoose from 'mongoose';
import app from './app';
import config from './config/index';
import logger from './utils/logger';
import globalErrorHandler from './middlewares/globalErrorHandler';
import notFound from './middlewares/notFound';

async function bootstrap(): Promise<void> {
  try {
    if (!config.database_url) {
      logger.error('FATAL: Database URL is not defined in .env file.');
      process.exit(1);
    }

    // Connect to DB
    await mongoose.connect(config.database_url);
    logger.info('️✔️ Database connected successfully');

    // Add final middlewares
    app.use(globalErrorHandler);
    app.use(notFound);

    // Start server
    app.listen(config.port, () => {
      logger.info(\`✔️ Server is listening on port \${config.port}\`);
    });

  } catch (err: unknown) {
    if (err instanceof Error) {
      logger.error(\`❌ Failed to bootstrap application: \${err.message}\`);
    } else {
      logger.error('❌ Failed to bootstrap application with an unknown error.');
    }
    process.exit(1);
  }
}

bootstrap();
`;
const globalErrorHandlerTemplate = String.raw`import { ErrorRequestHandler, Request, Response } from 'express';
import { ZodError, ZodIssue } from 'zod';
import mongoose, { Error as MongooseError } from 'mongoose';
import config from '../config/index';
import { IErrorSources } from '../interface/error';

// ---- Helper: standardized error response ----
const sendErrorResponse = (
  res: Response,
  statusCode: number,
  message: string,
  errorSources: IErrorSources,
  stack?: string,
): Response => {
  return res.status(statusCode).json({
    success: false,
    message,
    errorSources,
    ...(stack ? { stack } : {}),
  });
};

// ---- Handle Zod validation error ----
const handleZodError = (
  err: ZodError,
): {
  statusCode: number;
  message: string;
  errorSources: IErrorSources;
} => {
  const errorSources: IErrorSources = err.issues.map((issue: ZodIssue) => ({
    path: issue.path.length ? String(issue.path[issue.path.length - 1]) : '',
    message: issue.message,
  }));

  return { statusCode: 400, message: 'Validation Error', errorSources };
};

// ---- Handle Mongoose validation error ----
const handleMongooseValidationError = (
  err: MongooseError.ValidationError,
): { statusCode: number; message: string; errorSources: IErrorSources } => {
  const errorSources: IErrorSources = Object.values(err.errors).map(val => ({
    path: val.path,
    message: val.message,
  }));

  return { statusCode: 400, message: 'Validation Error', errorSources };
};

// ---- Handle Mongoose cast error ----
const handleMongooseCastError = (
  err: MongooseError.CastError,
): { statusCode: number; message: string; errorSources: IErrorSources } => {
  const errorSources: IErrorSources = [
    { path: err.path, message: err.message },
  ];
  return { statusCode: 400, message: 'Invalid ID', errorSources };
};

// ---- Handle duplicate key error ----
const handleMongooseDuplicateError = (err: {
  message: string;
}): { statusCode: number; message: string; errorSources: IErrorSources } => {
  const match = err.message.match(/"([^"]*)"/);
  const extracted = match?.[1];
  const errorSources: IErrorSources = [
    {
      path: '',
      message: \`\${extracted || 'The value'} already exists.\`,
    },
  ];
  return { statusCode: 409, message: 'Duplicate Key Error', errorSources };
};

// ---- Type guards ----
const hasCode = (err: unknown): err is { code: number } =>
  typeof err === 'object' &&
  err !== null &&
  'code' in err &&
  typeof (err as { code: unknown }).code === 'number';

const hasMessage = (err: unknown): err is { message: string } =>
  typeof err === 'object' &&
  err !== null &&
  'message' in err &&
  typeof (err as { message: unknown }).message === 'string';

// ---- Global Error Handler ----
const globalErrorHandler: ErrorRequestHandler = (
  err: unknown,
  req: Request,
  res: Response,
): Response => {
  let statusCode = 500;
  let message = 'Something went wrong!';
  let errorSources: IErrorSources = [{ path: '', message }];

  if (err instanceof ZodError) {
    ({ statusCode, message, errorSources } = handleZodError(err));
  } else if (err instanceof mongoose.Error.ValidationError) {
    ({ statusCode, message, errorSources } =
      handleMongooseValidationError(err));
  } else if (err instanceof mongoose.Error.CastError) {
    ({ statusCode, message, errorSources } = handleMongooseCastError(err));
  } else if (hasCode(err) && err.code === 11000 && hasMessage(err)) {
    ({ statusCode, message, errorSources } = handleMongooseDuplicateError(err));
  } else if (err instanceof Error) {
    message = err.message;
    errorSources = [{ path: '', message }];
  }

  return sendErrorResponse(
    res,
    statusCode,
    message,
    errorSources,
    config.node_env === 'development' && err instanceof Error
      ? err.stack
      : undefined,
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
const errorInterfaceTemplate = `export interface IErrorSources {
  path: string | number;
  message: string;
}[]
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
