const fs = require('fs-extra')
const writePkg = require('write-pkg')
const {resolve} = require('path')
const {exec} = require('child-process-promise')
const {TypeError} = require('error-clean-stack')
const {runner} = require('p-all-runner')

module.exports = async (dir, {browser = false, esm = false}) => {
  const pkgPath = resolve(dir, 'package.json')

  if (!await fs.pathExists(pkgPath)) {
    throw new TypeError('There is no "package.json')
  }

  const pool = runner()
  const deps = ['ava']
  const requires = []

  if (browser) {
    deps.push('browser-env')
    requires.push('./test/helpers/setup-browser-env.js')

    pool.add(async () => {
      const envFile = resolve(dir, './test/helpers/setup-browser-env.js')
      await fs.ensureFile(envFile)
      await fs.createFile(envFile, `
${esm ? "import browserEnv from 'browser-env'" : "const browserEnv = require('browser-env')"};
browserEnv();
      `.trim())
    })
  }

  if (esm) {
    deps.push('esm')
    requires.push('esm')
  }

  pool.add(async () => {
    await exec(`yarn add ${deps.join(' ')} --dev`, {cwd: dir})

    if (requires.length === 0) return

    await writePkg(pkgPath, {
      ...require(pkgPath),
      ava: {
        require: requires
      }
    })
  })
}
