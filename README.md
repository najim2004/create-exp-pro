# ncli - Express Project Generator

![NPM](https://img.shields.io/npm/v/ncli) ![NPM](https://img.shields.io/npm/dw/ncli)

A powerful CLI tool to scaffold professional, production-ready Express.js projects with a single command.

## About

`ncli` is designed to save you time by setting up a complete backend project with a robust and scalable architecture. It generates a TypeScript-based Express.js project with pre-configured logging, error handling, and essential development tools.

## Installation

Install `ncli` globally on your system using npm.

```bash
npm install -g ncli
```

## Updating ncli

To update `ncli` to the latest version, run the following command:

```bash
npm install -g ncli@latest
```

## Usage

`ncli` provides a simple and intuitive command-line interface.

### Create a New Project

To create a new Express.js project, use the `create project` command.

```bash
ncli create project <your-project-name>
```

Example:
```bash
ncli create project my-awesome-api
```

This will create a new directory named `my-awesome-api` with the complete project structure.

### Generate a New Module

Once inside a project created by `ncli`, you can easily generate a new feature module (including controller, service, route, and validation files) using the `create module` command.

```bash
ncli create module <module-name>
```

Example:
```bash
ncli create module user
```

To also generate a Mongoose model and a TypeScript interface for the module, use the `-m` or `--model` flag.

```bash
ncli create module product --model
# or using the alias
ncli create module product -m
```

## Features of Generated Projects

- **TypeScript First:** The entire codebase is in TypeScript.
- **Professional Structure:** Well-organized directories for modules, middlewares, configs, and utils.
- **Automatic Request Logging:** Uses `pino-http` to log every incoming request.
- **Robust Error Handling:** A global error handler ensures that no error goes unhandled and provides consistent error responses.
- **Pre-configured Tools:**
  - **ESLint & Prettier:** For consistent code style and formatting.
  - **Husky & lint-staged:** Runs linting on staged files before every commit to maintain code quality.
- **Ready-to-use Scripts:** `dev`, `build`, and `start` scripts are pre-configured.

---

Happy Coding!
