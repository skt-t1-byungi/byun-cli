#!/usr/bin/env node
const {Cac} = require('cac')
const path = require('path')
const ora = require('ora')
const byun = require('../lib')
const prompts = require('prompts')
const kebabCase = require('lodash.kebabcase')

const cli = new Cac({bin: 'byun'})

cli
  .command('new', 'Create new project.', async ipts => {
    const cwd = process.cwd()
    let name, dir

    if (ipts[0]) {
      name = ipts[0]
      dir = path.resolve(cwd, name)
    } else {
      const {continueOk} = await prompts({
        type: 'confirm',
        name: 'continueOk',
        message: 'continue in the current folder??',
        initial: true
      })

      if (!continueOk) return failLog('stop~')

      name = path.basename(cwd)
      dir = cwd
    }

    // convert to kebab
    name = kebabCase(name)

    const log = newLog(`Creating "${name}" project.`)
    try {
      await byun.new({name, dir})
      log.succeed(`"${name}" was created.`)
    } catch (err) {
      log.fail(err)
    }
  })

cli
  .command('ava', 'Prepare AVA.', async (ipts, {esm, browser}) => {
    const dir = ipts[0] || process.cwd()

    const log = newLog('preparing...')
    try {
      await byun.ava(dir, {browser, esm})
      log.succeed('prepared AVA.')
    } catch (err) {
      log.fail(err)
    }
  })
  .option('esm', { type: 'boolean', alias: 'es', default: false })
  .option('browser', { type: 'boolean', alias: 'b', default: false })

cli.parse()

function newLog (opts) {
  return ora(opts).start()
}
function failLog (opts) {
  return ora(opts).fail()
}
