import { defineConfig, loadEnv } from 'vite'
import vueJsx from '@vitejs/plugin-vue-jsx'
import path from 'path'
import VueTypeImports from 'vite-plugin-vue-type-imports'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import Components from 'unplugin-vue-components/vite'
const nodeEnv = process.env.NODE_ENV || 'production'
const env = loadEnv(nodeEnv, __dirname)
// import { postcssIsolateStyles } from 'vitepress'
// import tailwindcss from 'tailwindcss'
// import autoprefixer from 'autoprefixer'
const suffix = process.env.NODE_ENV === 'development' ? '' : '.ssr'
console.log(suffix, 'suffix')
export default defineConfig({
  ssr: {
    noExternal: ['element-plus'],
  },
  plugins: [
    vueJsx(),
    VueTypeImports(),
    Components({
      include: [/\.vue$/, /\.vue\?vue/, /\.md$/, /\.tsx/, /\.jsx/],
      resolvers: [
        ElementPlusResolver({
          importStyle: 'sass',
        }),
      ],
    }),
  ],

  resolve: {
    alias: {
      '@': path.resolve(__dirname, '../src'),
      components: path.resolve(__dirname, '../src/components'),
      sdk: path.resolve(__dirname, `../src/cms/sdk.es${suffix}.js`),
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
      '/hubs': {
        target: env.VITE_API_URL,
        changeOrigin: true,
        ws: true,
      },
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    chunkSizeWarningLimit: 1500,
    target: 'ES2022',
    rollupOptions: {},
    //   output: {
    //     entryFileNames: `index.js`,
    //   },
  },
  css: {
    // postcss: {
    //   plugins: [
    //     postcssIsolateStyles({
    //       includeFiles: [/vp-doc\.css/],
    //     }),
    //     tailwindcss(),
    //     autoprefixer(),
    //   ],
    // },
    preprocessorOptions: {
      scss: {
        additionalData: `
          @use "@/assets/styles/element.scss" as *;
        `,
      },
    },
  },
})
