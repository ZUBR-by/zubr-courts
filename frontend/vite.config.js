import {defineConfig} from 'vite'
import vue            from '@vitejs/plugin-vue'
import usePluginImport from 'vite-plugin-importer'

export default defineConfig({
    plugins: [
        vue(),
        usePluginImport({
            libraryName: "element-plus",
            libraryDirectory: "es",
            customStyleName: (name) => {
                if (name === 'locale') {
                    return `element-plus/packages/theme-chalk/src/button.scss`
                }
                return `element-plus/packages/theme-chalk/src/${name.replace('el-','')}.scss`;
            },
        }),
    ],
    resolve: {
        alias: {
            'vue' : 'vue/dist/vue.esm-bundler.js'
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
                'src/court_list.js'
            ]
        },
        outDir : './../assets/generated'
    },
    css: {
        preprocessorOptions : {
            scss: {
                additionalData: `
$--color-primary: #ff5c01;
$--color-success: #ff5c01;
$--input-placeholder-color: rgba(255,92,1,0.3);

$--select-border-color-hover: #FF5C01;

$--border-color-base: #FF5C01;
$--select-input-focus-border-color: #FF5C01;   
`
            }
        }
    }
})
