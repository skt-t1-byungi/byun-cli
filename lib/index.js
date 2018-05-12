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
    'eslintConfig': {
      'extends': 'byungi'
    }
  })

  parallelJobs.push(
    fs.writeFile(pr(dir, '.gitignore'), 'node_modules/')
  )

  await exec('yarn add eslint eslint-config-byungi --dev', {cwd: dir})
  await Promise.all(parallelJobs)
}
