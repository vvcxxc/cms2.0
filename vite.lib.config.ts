import path from 'path'
import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'
import { buildPlugin } from 'vite-plugin-build'
import { globSync } from 'glob'
import { readFileSync, existsSync } from 'fs'
import cssInjectedByJsPlugin from 'vite-plugin-css-injected-by-js'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import VitePluginWidgetProvider from './script/plugins/vite-plugin-widget-provider'
import VitePluginDevelopmentFilter from './script/plugins/vite-plugin-development-filter'
import vitePluginImageFilter from './script/plugins/vite-plugin-image-filter'
import vueJsx from '@vitejs/plugin-vue-jsx'
import { optimizeLodashImports } from '@optimize-lodash/rollup-plugin'
import dayjs from 'dayjs'
import VueTypeImports from 'vite-plugin-vue-type-imports'
import svgIcon from 'vite-plugin-svgicon'
const execa = require('execa')
const isWin = process.platform === 'win32'
const isCustom = process.env.NODE_TYPE === 'custom'
const argvPath: string = './script/.argv'
const isSingleBuild = existsSync(argvPath)
const tag = 'information-debugger'
let getWidgetNames: Array<string> = []
import slash from 'slash'

const vueBaseConfig = {
  template: {
    compilerOptions: {
      isCustomElement: (id) => [tag].includes(id),
    },
  },
}
let buildWidgets: null | Record<string, any> = null
if (isCustom) {
  try {
    const isHasBuild = existsSync('.build.local')
    if (isHasBuild) {
      const fileContent = readFileSync('.build.local').toString('utf8')
      if (fileContent) {
        buildWidgets = fileContent.split('\n').filter((v) => v)
      }
    } else {
      throw new Error('请先创建 .build.local文件')
    }
  } catch (error) {
    console.log('---------------转换失败----------------')
    console.log(error)
    console.log('----------------正在编译全部组件...----------------')
  }
}

function getGitHash() {
  return execa('git', ['rev-parse', '--short', 'HEAD'])
}

function getGitBranch() {
  return execa('git', ['rev-parse', '--abbrev-ref', 'HEAD'])
}

function getGitUserName() {
  return execa('git', ['config', 'user.name'])
}

if (isSingleBuild) {
  const widgetName = readFileSync(argvPath, { encoding: 'utf8' })
  getWidgetNames.push(widgetName)
} else {
  const widgetsPath = globSync(`./src/widgets/*/index.ts`)
  getWidgetNames = widgetsPath.map((file) => {
    const parts = isWin
      ? path.resolve(file).split('\\')
      : path.resolve(file).split('/')
    return parts[parts.length - 2]
  })
  if (buildWidgets) {
    getWidgetNames = getWidgetNames.filter((widgetName) => {
      return buildWidgets.includes(widgetName)
    })
  }
}

const library: any = getWidgetNames.map((name) => {
  return {
    outDir: 'dist',
    target: 'ES2022',
    rollupOptions: {
      external: ['vue', 'sdk'],
      output: {
        globals: {
          vue: 'Vue',
          sdk: 'sdk',
        },
      },
    },
    lib: {
      entry: path.join(__dirname, `./src/widgets/${name}/index.ts`),
      name: '__importWidgets',
      formats: ['umd'],
      fileName: () => {
        return isWin ? `${name}\\index.js` : `${name}/index.js`
      },
    },
  }
})

//@ts-ignore
export default defineConfig(async ({ mode }) => {
  let commit,
    branch,
    userName = {
      stdout: '',
    }
  try {
    commit = await getGitHash()
    branch = await getGitBranch()
    userName = await getGitUserName()
  } catch (error) {
    console.log(error)
  }
  return {
    define: {
      'process.env': process.env,
      'window.__BUILD_TIME__': `"${dayjs().format('YYYY-MM-DD HH:mm:ss')}"`,
      'window.__COMMIT__': `"${commit.stdout}"`,
      'window.__BRANCH__': `"${branch.stdout}"`,
      'window.__USER_NAME__': `"${userName.stdout}"`,
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'),
        components: path.resolve(__dirname, './src/components'),
        sdk: path.resolve(__dirname, 'src/cms/sdk.es.js'),
      },
    },
    publicDir: false,

    plugins: [
      svgIcon({
        include: [slash(path.resolve('./src/assets/svg-icon/*.svg'))],
      }),
      VitePluginDevelopmentFilter({ tag }),

      vueJsx(vueBaseConfig.template.compilerOptions),
      vue({
        ...vueBaseConfig,
        reactivityTransform: path.resolve(__dirname, 'src'),
      }),
      VueTypeImports(),
      VitePluginWidgetProvider(),
      cssInjectedByJsPlugin(),
      buildPlugin({
        fileBuild: false,
        libBuild: {
          buildOptions: library,
        },
      }),
      Components({
        include: [/\.vue$/, /\.vue\?vue/, /\.md$/, /\.tsx/, /\.jsx/],
        resolvers: [
          ElementPlusResolver({
            importStyle: 'sass',
          }),
        ],
      }),
      optimizeLodashImports(),
      // vitePluginImageFilter()
    ],
    esbuild: {
      drop: mode !== 'development' ? ['debugger', 'console'] : [],
    },
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `@use "@/assets/styles/element.scss" as *;`,
        },
      },
    },
  }
})
