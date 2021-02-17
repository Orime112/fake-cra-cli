const chalk = require("chalk")
const { Command } = require("commander")

const program = new Command("create-react-app2")
program
  .version("1.0.0")
  .arguments("<must1> <must2> [option1] [option2]")
  .usage(`${chalk.bgMagentaBright("<must1> <must2> [option1] [option2]")}`)
  .action((must1, must2, option1, option2) => {
    console.log(must1, must2, option1, option2)
  })
  .parse(process.argv)
