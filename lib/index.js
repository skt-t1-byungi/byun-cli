const fs = require('fs-extra')
const writePkg = require('write-pkg')
const {resolve: pr} = require('path')
const {exec} = require('child-process-promise')
const {TypeError} = require('error-clean-stack')

exports.new = async ({name, cwd = process.cwd()}) => {
  const dir = pr(cwd, name)
  const pkgPath = pr(dir, 'package.json')
  const parallelJobs = []

  if (await fs.pathExists(pkgPath)) {
    throw new TypeError(`"${name}" is already exists.`)
  }

  await fs.ensureDir(dir)
  await writePkg(pkgPath, {
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

  parallelJobs.push(
    fs.writeFile(pr(dir, '.gitignore'), 'node_modules/')
  )

  await exec('yarn install', {cwd: dir})
  await Promise.all(parallelJobs)
}
