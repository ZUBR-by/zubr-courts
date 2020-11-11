module.exports = {
    outputDir          : './../assets/generated',
    pages              : {
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
    },
    filenameHashing    : false,
    chainWebpack       : config => {
        config.plugins.delete('html')
        config.plugins.delete('preload')
        config.plugins.delete('prefetch')
    },
    productionSourceMap: false,
    runtimeCompiler    : true
}
