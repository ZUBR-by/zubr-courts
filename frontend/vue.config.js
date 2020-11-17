const pages = {
    judge : {
        entry: 'src/judge.js',
    },
    judges: {
        entry: 'src/judge_list.js',
    },
    court : {
        entry: 'src/court.js',
    },
    courts: {
        entry: 'src/court_list.js',
    },
}
module.exports = {
    outputDir          : './../assets/generated',
    pages              ,
    filenameHashing    : false,
    chainWebpack: config => {
        config.plugins.delete('html')
        config.plugins.delete('preload')
        config.plugins.delete('prefetch')

        const options   = module.exports;
        const pages     = options.pages;
        const pageKeys  = Object.keys(pages);
        // Long-term caching
        const IS_VENDOR = /[\\/]node_modules[\\/]/;
        let result      = {}
        if (process.env.NODE_ENV !== 'development') {
            let filtered = pageKeys.map(key => ({
                name    : `chunk-${key}-vendors`,
                priority: -11,
                chunks  : chunk => chunk.name === key,
                test    : IS_VENDOR,
                enforce : true,
            }));
            for (let index in filtered) {
                result[index + ''] = filtered[index];
            }
        }
        config.optimization.splitChunks({cacheGroups: result})
    },
    productionSourceMap: false,
    runtimeCompiler    : true
}
