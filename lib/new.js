const fs = require('fs-extra')
const writePkg = require('write-pkg')
const {resolve} = require('path')
const {exec} = require('child-process-promise')
const {TypeError} = require('error-clean-stack')
const {runner} = require('p-all-runner')

module.exports = async ({ name, dir = resolve(process.cwd(), name) }) => {
  const pkgPath = resolve(dir, 'package.json')

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

  const pool = runner()

  pool.add(
    fs.writeFile(resolve(dir, '.gitignore'), 'node_modules/'),
    exec('yarn add eslint eslint-config-byungi --dev', {cwd: dir})
  )

  await pool.wait()
}
