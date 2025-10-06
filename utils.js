const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");
const ora = require("ora");

const capitalize = (s) => s.charAt(0).toUpperCase() + s.slice(1);

async function installDependenciesSequentially(
  packageList,
  isDev = false,
  projectPath
) {
  const failedPackages = [];
  const installedPackagesWithVersions = {};
  const installCommand = isDev ? "npm install -D" : "npm install";
  const dependencyType = isDev ? "devDependencies" : "dependencies";

  const spinner = ora(`Installing ${dependencyType}...`).start();

  for (const pkgName of packageList) {
    spinner.text = `Installing ${pkgName}...`;
    try {
      execSync(`${installCommand} ${pkgName} --no-save`, {
        stdio: "pipe",
        cwd: projectPath,
      });

      let actualPackageNameForNodeModules;
      if (pkgName.startsWith("@")) {
        const parts = pkgName.split("/");
        actualPackageNameForNodeModules = parts[0] + "/" + parts[1];
      } else {
        actualPackageNameForNodeModules = pkgName;
      }

      const nodeModulesPath = path.join(
        projectPath,
        "node_modules",
        actualPackageNameForNodeModules
      );
      const isNodeModulePresent = fs.existsSync(nodeModulesPath);

      if (isNodeModulePresent) {
        const installedPackageJsonPath = path.join(
          nodeModulesPath,
          "package.json"
        );
        const installedPackageJson = JSON.parse(
          fs.readFileSync(installedPackageJsonPath, "utf8")
        );
        const installedVersion = installedPackageJson.version;

        installedPackagesWithVersions[pkgName] = `^${installedVersion}`;
        spinner.succeed(`Installed ${pkgName}@${installedVersion}`);
      } else {
        spinner.warn(`Verification failed for ${pkgName}.`);
        failedPackages.push(pkgName);
      }
    } catch (error) {
      spinner.fail(`Failed to install ${pkgName}`);
      failedPackages.push(pkgName);
    }
  }
  spinner.stop();
  return { failedPackages, installedPackagesWithVersions };
}

function initializeHusky(projectPath) {
  const spinner = ora("Initializing Husky & Lint Staged...").start();
  try {
    execSync("npm install husky --save-dev", {
      stdio: "pipe",
      cwd: projectPath,
    });
    execSync("npx husky init", { stdio: "pipe", cwd: projectPath });
    execSync('npx husky add .husky/pre-commit "npx lint-staged"', {
      stdio: "pipe",
      cwd: projectPath,
    });
    spinner.succeed("Husky & Lint Staged initialized successfully.");
  } catch (error) {
    spinner.fail("Failed to initialize Husky & Lint Staged.");
  }
}

module.exports = {
  capitalize,
  installDependenciesSequentially,
  initializeHusky,
};
