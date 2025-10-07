#!/usr/bin/env node

const { program } = require("commander");
const { scaffoldNewProject, generateModule } = require("./commands");
const packageJson = require("./package.json");

// Program definition
program
  .name("nxpcli")
  .description(packageJson.description)
  .version(packageJson.version);

// `create` command
const createCommand = program.command("create");

// `create <project-name>` subcommand
createCommand
  .command("project <project-name>")
  .alias("p")
  .description("Create a new professional Express.js project.")
  .action((projectName) => {
    scaffoldNewProject(projectName);
  });

// `create module <module-name>` subcommand
createCommand
  .command("module <module-name>")
  .alias("m")
  .description("Generate a new module in an existing project.")
  .option("-m, --model", "Generate Mongoose model and interface files", false)
  .action((moduleName, options) => {
    generateModule(moduleName.toLowerCase(), options.model);
  });

program.parse(process.argv);