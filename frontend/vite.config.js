import {defineConfig}        from 'vite'
import vue                   from '@vitejs/plugin-vue'
import AutoImport            from 'unplugin-auto-import/vite'
import Components            from 'unplugin-vue-components/vite'
import {ElementPlusResolver} from 'unplugin-vue-components/resolvers'
import ElementPlus           from 'unplugin-element-plus/vite'
import path                  from 'path'

export default defineConfig({
    plugins: [
        vue(),
        AutoImport({
            resolvers: [ElementPlusResolver()],
        }),
        Components({
            resolvers: [ElementPlusResolver()],
        }),
        ElementPlus({
            useSource: true,
        }),
    ],
    resolve: {
        alias: {
            '~/' : `${path.resolve(__dirname, 'src')}/`,
            'vue': 'vue/dist/vue.esm-bundler.js'
        }
    },
    build  : {
        manifest     : true,
        rollupOptions: {
            input: [
                'src/index.js',
                'src/judge_list.js',
                'src/judge.js',
                'src/court.js',
                'src/court_list.js',
                'src/prosecutor.js',
                'src/prosecutor_list.js'
            ]
        },
        outDir       : './../assets/generated'
    },
    css    : {
        preprocessorOptions: {
            scss: {
                additionalData: `@use "~/styles/element.scss" as *;`
            }
        }
    }
})
