#!/usr/bin/env node
const {Cac} = require('cac')
const path = require('path')
const byun = require('../lib')
const chalk = require('chalk')

const log = messgae => console.log(chalk.bgCyan.white('BYUN') + messgae)
const cli = new Cac({bin: 'byun'})

cli
  .command('new', {
    desc: 'Create new package.'
  }, async ipt => {
    let cwd = process.cwd()
    let name = ipt[0]

    if (!name) {
      cwd = path.resolve(cwd, '../')
      name = path.basename(cwd)
    }

    log(`Creating, "${name}".`)
    await byun.new({name, cwd})
    log(`"${name}" created.`)
  })
