#!/usr/bin/env node
const {Cac} = require('cac')
const path = require('path')
const ora = require('ora')
const byun = require('../lib')
const prompts = require('prompts')
const kebabCase = require('lodash.kebabcase')

const cli = new Cac({bin: 'byun'})

cli
  .command('new', {
    desc: 'Create new project.'
  }, async ipts => {
    let cwd = process.cwd()
    let name = ipts[0]

    if (!name) {
      const {continueOk} = await prompts({
        type: 'confirm',
        name: 'continueOk',
        message: `continue in the current folder??`
      })

      if (!continueOk) return ora('stop').fail()

      name = path.basename(cwd)
      cwd = path.resolve(cwd, '../')
    }

    // convert to kebab
    name = kebabCase(name)

    const spinner = ora(`Creating "${name}" project.`).start()
    try {
      await byun.new({name, cwd})
      spinner.succeed(`"${name}" was created.`)
    } catch (err) {
      spinner.fail(err)
    }
  })

cli.parse()
