module.exports = {
    outputDir          : './../assets/generated',
    pages              : {
        judge: {
            entry: 'src/judge.js',
        },
        court: {
            entry: 'src/court.js',
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
