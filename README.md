# nxpcli - Express CLI

![NPM](https://img.shields.io/npm/v/nxpcli) ![NPM](https://img.shields.io/npm/dw/nxpcli)

A powerful CLI tool to scaffold professional, production-ready Express.js projects with a single command.

## About

`nxpcli` (Najim's Express CLI) is designed to save you time by setting up a complete backend project with a robust and scalable architecture. It generates a TypeScript-based Express.js project with pre-configured logging, error handling, and essential development tools.

## Installation

Install `nxpcli` globally on your system using npm.

```bash
npm install -g nxpcli
```

## Updating nxpcli

To update `nxpcli` to the latest version, run the following command:

```bash
npm install -g nxpcli@latest
```

## Uninstalling the CLI

To uninstall `nxpcli` from your system, run the following command:

```bash
npm uninstall -g nxpcli
```

## Usage

`nxpcli` provides a simple and intuitive command-line interface.

### Create a New Project

To create a new Express.js project, use the `create project` command.

```bash
nxpcli create project <your-project-name>
```

Example:
```bash
nxpcli create project my-awesome-api
```

This will create a new directory named `my-awesome-api` with the complete project structure.

### Generate a New Module

Once inside a project created by `nxpcli`, you can easily generate a new feature module (including controller, service, route, and validation files) using the `create module` command.

```bash
nxpcli create module <module-name>
```

Example:
```bash
nxpcli create module user
```

To also generate a Mongoose model and a TypeScript interface for the module, use the `-m` or `--model` flag.

```bash
nxpcli create module product --model
# or using the alias
nxpcli create module product -m
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

## Included Technologies

When you create a new project with `nxpcli`, it comes with a set of pre-configured technologies to get you started quickly. Below is a list of the core dependencies that are automatically installed. You can manage them using `npm install` and `npm uninstall`.

### Core Dependencies

| Package       | Description                               | Install Command             | Uninstall Command               |
|---------------|-------------------------------------------|-----------------------------|---------------------------------|
| `express`     | Fast, unopinionated, minimalist web framework for Node.js. | `npm install express`       | `npm uninstall express`         |
| `mongoose`    | Elegant MongoDB object modeling for Node.js. | `npm install mongoose`      | `npm uninstall mongoose`        |
| `typescript`  | Superset of JavaScript that adds types.   | `npm install -D typescript` | `npm uninstall -D typescript`   |
| `zod`         | TypeScript-first schema validation with static type inference. | `npm install zod`           | `npm uninstall zod`             |
| `pino`        | Extremely fast, low-overhead logger.      | `npm install pino`          | `npm uninstall pino`            |
| `pino-http`   | High-speed HTTP logger for Node.js.       | `npm install pino-http`     | `npm uninstall pino-http`       |
| `cors`        | Middleware for enabling Cross-Origin Resource Sharing. | `npm install cors`          | `npm uninstall cors`            |
| `dotenv`      | Loads environment variables from a `.env` file. | `npm install dotenv`        | `npm uninstall dotenv`          |

### Development Dependencies

| Package       | Description                               | Install Command             | Uninstall Command               |
|---------------|-------------------------------------------|-----------------------------|---------------------------------|
| `nodemon`     | Automatically restarts the server on file changes. | `npm install -D nodemon`    | `npm uninstall -D nodemon`      |
| `eslint`      | Pluggable and configurable linter tool for identifying and reporting on patterns in JavaScript. | `npm install -D eslint`     | `npm uninstall -D eslint`       |
| `prettier`    | Opinionated code formatter.               | `npm install -D prettier`   | `npm uninstall -D prettier`     |
| `husky`       | Makes it easy to use Git hooks.           | `npm install -D husky`      | `npm uninstall -D husky`        |
| `lint-staged` | Run linters on git staged files.          | `npm install -D lint-staged`| `npm uninstall -D lint-staged`  |
| `ts-node`     | TypeScript execution and REPL for Node.js. | `npm install -D ts-node`    | `npm uninstall -D ts-node`      |
| `pino-pretty` | A core utility for `pino` that makes logs more readable. | `npm install -D pino-pretty`| `npm uninstall -D pino-pretty`  |

## Environment Variables

The project uses the following environment variables. You can set them in a `.env` file in the root of your project.

| Variable       | Description                                       | Default                                         |
|----------------|---------------------------------------------------|-------------------------------------------------|
| `NODE_ENV`     | The environment mode.                             | `development`                                   |
| `PORT`         | The port the server will run on.                  | `5000`                                          |
| `DATABASE_URL` | The connection string for your MongoDB database. | `mongodb://127.0.0.1:27017/<your_database_name>` |

---

Happy Coding!

## Contact

- **Name:** Najim
- **Email:** itsnajim.mail@gmail.com
- **GitHub:** [https://github.com/najim2004](https://github.com/najim2004)
- **Portfolio:** [najim.vercel.app](https://najim.vercel.app)
- **LinkedIn:** [linkedin.com/in/its-najim](https://linkedin.com/in/its-najim)
