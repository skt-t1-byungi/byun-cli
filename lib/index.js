const fs = require('fs-extra')
const {resolve: pResolve} = require('path')
const {exec} = require('child-process-promise')

exports.new = async ({name, cwd = process.cwd()}) => {
  const dir = pResolve(cwd, name)
  const etcJobs = []

  await fs.ensureDir(dir)
  await fs.writeJSON(pResolve(dir, 'package.json'), {
    name,
    'version': '0.0.0',
    'main': 'index.js',
    'license': 'MIT',
    'devDependencies': {
      'eslint': '^4.19.1',
      'eslint-config-byungi': '^0.0.13'
    },
    'eslintConfig': {
      'extends': 'byungi'
    }
  })

  etcJobs.push(
    fs.writeFile(pResolve(dir, '.gitignore', `
node_modules/
    `))
  )

  await exec('yarn install', {cwd: dir})
}
