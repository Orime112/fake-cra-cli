const chalk = require("chalk")
const { Command } = require("commander")
const packageJSON = require("./package.json")
const path = require("path")
const fs = require("fs-extra")
const { runInContext } = require("vm")
const { spawn } = require("cross-spawn")

async function init() {
  let projectName
  new Command(packageJSON.name)
    .version(packageJSON.version)
    .arguments("<project-name>")
    .usage(`${chalk.yellowBright("<project-name>")}`)
    .action((name) => {
      projectName = name
    })
    .parse(process.argv)

  console.log(`projectName is: ${projectName}`)

  await createApp(projectName)
}

async function createApp(appName) {
  const root = path.resolve(appName)
  fs.ensureDir(appName) // * 保证此目录存在，如果不存在则创建
  console.log(`Creating a new React app in ${chalk.greenBright(root)}`)
  const packageJSON = {
    name: appName,
    version: "0.1.0",
    private: true,
  }
  fs.writeFileSync(path.resolve(root, "package.json"), JSON.stringify(packageJSON, null, 2))
  const originDirectory = process.cwd()
  process.chdir(root) // * 将当前工作目录改到了 root 目录里

  console.log("root", root)
  console.log("originDirectory", originDirectory)
  console.log("current work directory", process.cwd())

  await run(root, appName, originDirectory)
}

async function run(root, appName, originDirectory) {
  const scriptName = "react-scripts"
  const templateName = "cra-template"
  const allDependencies = ["react", "react-dom", scriptName, templateName]
  console.log(`Installing packages. This might take a couple of minutes.`)
  console.log(
    `Installing ${chalk.cyan("react")}, ${chalk.cyan("react-dom")}, and ${chalk.cyan(
      scriptName
    )}${` with ${chalk.cyan(templateName)}`}...`
  )
  await install(root, allDependencies)
  // ! 装包完成，开始下一个任务
  const data = [root, appName, true, originDirectory, templateName]
  const source = `
      var init = require('react-scripts/scripts/init.js')
      init.apply(null, JSON.parse(process.argv[1]))
  `
  await executeNodeScript({ cwd: process.cwd() }, data, source)
  console.log(`Done.`)
  process.exit()
}

async function executeNodeScript({ cwd }, data, source) {
  return new Promise((resolve) => {
    const child = spawn(process.execPath, ["-e", source, "--", JSON.stringify(data)], {
      cwd,
      stdio: "inherit",
    })
    console.log(cwd, data, source, "cds")
    child.on("close", resolve)
  })
}

async function install(root, allDependencies) {
  return new Promise((resolve) => {
    const command = "yarnpkg"
    const args = ["add", ...allDependencies, "--cwd", root]
    const child = spawn(command, args, { stdio: "inherit" })
    child.on("close", resolve)
    child.on("error", (err) => {
      console.log(err, "err")
    })
  })
}

module.exports = {
  init,
}
