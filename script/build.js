const { writeFileSync, rmSync } = require('fs')
const { spawn } = require('node:child_process')
const { globSync } = require('glob')
const path = require('path')
const fs = require('fs-extra')

let isSingleBuild = false
const isWin = process.platform === 'win32'
const argvPath = './script/.argv'
const widgetName = process.argv[process.argv.length - 1]
const widgetsPath = globSync(`./src/widgets/*/index.ts`)
const getWidgetNames = widgetsPath.map((file) => {
  const parts = isWin
    ? path.resolve(file).split('\\')
    : path.resolve(file).split('/')
  return parts[parts.length - 2]
})

if (getWidgetNames.includes(widgetName)) {
  isSingleBuild = true
  writeFileSync(argvPath, widgetName)
}

try {
  fs.removeSync('./dist')
} catch (error) {
  console.error('dist不存在，继续执行打包任务')
}

const run = spawn(
  process.platform === 'win32' ? 'npm.cmd' : 'npm',
  ['run', 'build-lib'],
  { stdio: 'inherit' , shell: true}
)

run.on('close', (code) => {
  if (code == 0 && isSingleBuild) rmSync(argvPath)
})
