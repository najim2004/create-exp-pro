const fs = require("fs");
const path = require("path");
const ora = require("ora");
const { installDependenciesSequentially, initializeHusky } = require("./utils");
const {
  getPackageJsonTemplate,
  tsconfigTemplate,
  nodemonTemplate,
  appTsTemplate,
  serverTsTemplate,
  globalErrorHandlerTemplate,
  validateRequestTemplate,
  errorInterfaceTemplate,
} = require("../templates/projectTemplates");
const {
  gitignoreTemplate,
  prettierrcTemplate,
  eslintrcTemplate,
  readmeTemplate,
  envTemplate,
  configIndexTemplate,
  notFoundTemplate,
  loggerTemplate,
} = require("../templates/commonTemplates");
const { requestLoggerTemplate } = require("../templates/middlewares");
const {
  getModuleRouteTemplate,
  getModuleControllerTemplate,
  getModuleServiceTemplate,
  getModuleValidationTemplate,
  getModuleModelTemplate,
  getModuleInterfaceTemplate,
} = require("../templates/moduleTemplates");

const scaffoldNewProject = async (projectName) => {
  const projectPath = path.join(process.cwd(), projectName);

  const scaffoldSpinner = ora(`Scaffolding new project '${projectName}'...`).start();

  if (fs.existsSync(projectPath)) {
    scaffoldSpinner.fail(`Directory ${projectName} already exists.`);
    process.exit(1);
  }
  fs.mkdirSync(projectPath, { recursive: true });
  scaffoldSpinner.succeed(`Created project directory: ${projectName}`);

  const dirSpinner = ora('Creating directory structure...').start();
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
  dirSpinner.succeed("Directory structure created.");

  const dependencies = [
    "cors",
    "dotenv",
    "express",
    "mongoose",
    "pino",
    "pino-http",
    "pino-pretty",
    "zod",
  ];
  const devDependencies = [
    "@types/pino-http",
    "typescript",
    "@types/cors",
    "@types/express",
    "@types/node",
    "@typescript-eslint/eslint-plugin",
    "@typescript-eslint/parser",
    "eslint",
    "eslint-config-prettier",
    "eslint-plugin-prettier",
    "husky",
    "lint-staged",
    "nodemon",
    "prettier",
    "ts-node",
  ];

  const packageJsonContentObj = JSON.parse(getPackageJsonTemplate(projectName));

  const { failedPackages: failedDeps, installedPackagesWithVersions: installedDeps } = await installDependenciesSequentially(dependencies, false, projectPath);
  const { failedPackages: failedDevDeps, installedPackagesWithVersions: installedDevDeps } = await installDependenciesSequentially(devDependencies, true, projectPath);

  Object.assign(packageJsonContentObj.dependencies, installedDeps);
  Object.assign(packageJsonContentObj.devDependencies, installedDevDeps);

  const fileSpinner = ora('Creating project files...').start();
  const files = [
    {
      name: "package.json",
      content: JSON.stringify(packageJsonContentObj, null, 2),
    },
    { name: "tsconfig.json", content: tsconfigTemplate },
    { name: "nodemon.json", content: nodemonTemplate },
    { name: ".gitignore", content: gitignoreTemplate },
    { name: "eslint.config.mjs", content: eslintrcTemplate },
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
      name: "src/middlewares/requestLogger.ts",
      content: requestLoggerTemplate,
    },
    {
      name: "src/middlewares/validateRequest.ts",
      content: validateRequestTemplate,
    },
    { name: "src/utils/logger.ts", content: loggerTemplate },
    { name: "src/interface/error.ts", content: errorInterfaceTemplate },
  ];

  files.forEach((file) => {
    fs.writeFileSync(path.join(projectPath, file.name), file.content);
  });
  fileSpinner.succeed("Project files created.");

  initializeHusky(projectPath);

  console.log("\n--- Installation Summary ---");
  if (failedDeps.length === 0 && failedDevDeps.length === 0) {
    console.log("✅ All packages installed successfully!");
  } else {
    console.warn("⚠️ Some packages failed to install. Please install them manually:");
    if (failedDeps.length > 0) {
      console.warn(`  Dependencies: ${failedDeps.join(", ")}`);
    }
    if (failedDevDeps.length > 0) {
      console.warn(`  DevDependencies: ${failedDevDeps.join(", ")}`);
    }
  }

  console.log(`\n✅ Project '${projectName}' created successfully!`);
  console.log(`\nTo get started:\n`);
  console.log(`  cd ${projectName}`);
  console.log(`  npm run dev\n`);
};

const generateModule = (moduleName, hasModel) => {
  const modulePath = path.join(process.cwd(), "src", "modules", moduleName);

  const moduleSpinner = ora(`Generating module '${moduleName}'...`).start();

  if (!fs.existsSync(path.join(process.cwd(), "src", "app.ts"))) {
    moduleSpinner.fail("Error: This command must be run from project root.");
    process.exit(1);
  }

  if (fs.existsSync(modulePath)) {
    moduleSpinner.fail(`Error: Module '${moduleName}' already exists.`);
    process.exit(1);
  }

  fs.mkdirSync(modulePath, { recursive: true });

  const filesToCreate = [
    { name: `${moduleName}.route.ts`, content: getModuleRouteTemplate(moduleName) },
    { name: `${moduleName}.controller.ts`, content: getModuleControllerTemplate(moduleName) },
    { name: `${moduleName}.validation.ts`, content: getModuleValidationTemplate(moduleName) },
    { name: `${moduleName}.service.ts`, content: getModuleServiceTemplate(moduleName, hasModel) },
  ];

  if (hasModel) {
    filesToCreate.push({ name: `${moduleName}.model.ts`, content: getModuleModelTemplate(moduleName) });
    filesToCreate.push({ name: `${moduleName}.interface.ts`, content: getModuleInterfaceTemplate(moduleName) });
  }

  filesToCreate.forEach((file) => {
    fs.writeFileSync(path.join(modulePath, file.name), file.content);
  });
  moduleSpinner.succeed(`Module files for '${moduleName}' created.`);

  const injectionSpinner = ora(`Injecting module '${moduleName}' into app.ts...`).start();
  const appTsPath = path.join(process.cwd(), "src", "app.ts");
  let appContent = fs.readFileSync(appTsPath, "utf8");

  const routeName = `${moduleName}Routes`;
  const importLine = `import { ${routeName} } from './modules/${moduleName}/${moduleName}.route';`;
  const useLine = `app.use('/api/v1/${moduleName}', ${routeName});`;
  const importMarker = "// <new-import-here>";
  const routeMarker = "// <new-route-here>";

  if (appContent.includes(importLine)) {
    injectionSpinner.info(`Module '${moduleName}' already injected. Skipping.`);
  } else {
    appContent = appContent.replace(importMarker, `${importLine}\n${importMarker}`);
    appContent = appContent.replace(routeMarker, `${useLine}\n${routeMarker}`);
    fs.writeFileSync(appTsPath, appContent);
    injectionSpinner.succeed(`Injected module '${moduleName}' into app.ts`);
  }

  console.log(`\n✅ Module '${moduleName}' created successfully!`);
};

module.exports = {
  scaffoldNewProject,
  generateModule,
};

