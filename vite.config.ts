import { defineConfig, loadEnv, createLogger } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import path from 'path'
import slash from 'slash'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import { optimizeLodashImports } from '@optimize-lodash/rollup-plugin'
import VueTypeImports from 'vite-plugin-vue-type-imports'
import topLevelAwait from 'vite-plugin-top-level-await'
import svgIcon from 'vite-plugin-svgicon'
import VitePluginDevelopmentFilter from './script/plugins/vite-plugin-development-filter'
// import requireTransform from 'vite-plugin-require-transform'
// import PurgeCSS from '@fullhuman/postcss-purgecss'
const tag = 'information-debugger'

// @ts-ignore
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, __dirname)
  console.info('[mode]', mode)
  console.info('[env]', env)
  const vueBaseConfig = {
    template: {
      compilerOptions: {
        isCustomElement: (id) => [tag].includes(id),
      },
    },
  }
  return {
    base: '/',
    plugins: [
      VitePluginDevelopmentFilter({ tag }),
      vueJsx(vueBaseConfig.template.compilerOptions),
      vue({
        ...vueBaseConfig,
        reactivityTransform: path.resolve(__dirname, 'src'),
      }),
      svgIcon({
        include: [slash(path.resolve('./src/assets/svg-icon/*.svg'))],
      }),
      VueTypeImports(),

      Components({
        include: [/\.vue$/, /\.vue\?vue/, /\.md$/, /\.tsx/, /\.jsx/],
        resolvers: [
          ElementPlusResolver({
            importStyle: 'sass',
          }),
        ],
      }),
      {
        name: 'fixHMR',
        handleHotUpdate({ modules, file }) {
          if (file.match(/\.(js|ts|css)$/)) return modules

          modules.map((m) => {
            m.importers = new Set()
          })
        },
      },
      optimizeLodashImports(),
      topLevelAwait({
        promiseExportName: '__tla',
        promiseImportName: (i) => `__tla_${i}`,
      }),
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
        components: path.resolve(__dirname, './src/components'),
        sdk: path.resolve(__dirname, 'src/cms/sdk.es.js'),
      },
    },
    server: {
      host: '0.0.0.0',
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
      origin: `//localhost:${env.VITE_PORT}`,
      // open: true,
      port: env.VITE_PORT,
      cors: true,
      proxy: {
        '/api': {
          target: env.VITE_API_URL,
          changeOrigin: true,
        },
        '/flows': {
          target: env.VITE_API_URL,
          changeOrigin: true,
        },
        '/hubs': {
          target: env.VITE_API_URL,
          changeOrigin: true,
          ws: true,
        },
      },
    },
    build: {
      outDir: 'wwwroot',
      minify: 'esbuild',
      sourcemap: true,
      chunkSizeWarningLimit: 1500,
      target: 'ES2022',
      rollupOptions: {
        output: {
          entryFileNames: `index.js`,
        },
      },
    },
    esbuild: {
      drop: mode !== 'development' ? ['console', 'debugger'] : [],
      keepNames: true,
    },
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `
            @use "@/assets/styles/element.scss" as *;
          `,
        },
      },
    },
  }
})
