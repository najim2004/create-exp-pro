#!/usr/bin/env node

const { scaffoldNewProject, generateModule } = require("./commands");

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
  }
};

main();