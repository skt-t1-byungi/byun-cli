#!/usr/bin/env node
const {Cac} = require('cac')
const path = require('path')
const ora = require('ora')
const byun = require('../lib')

const cli = new Cac({bin: 'byun'})

cli
  .command('new', {
    desc: 'Create new project.'
  }, async ipt => {
    let cwd = process.cwd()
    let name = ipt[0]

    if (!name) {
      cwd = path.resolve(cwd, '../')
      name = path.basename(cwd)
    }

    const spinner = ora(`Creating "${name}" project.`).start()
    try {
      await byun.new({name, cwd})
      spinner.succeed(`"${name}" was created.`)
    } catch (err) {
      spinner.fail(err)
    }
  })

cli.parse()

if (!cli.matchedCommand) cli.showHelp()
