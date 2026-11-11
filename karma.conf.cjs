// Los tests van en archivos *.spec.js (pueden usar JSX).
const fs = require('fs')
const { createInstrumenter } = require('istanbul-lib-instrument')

// Marca el código de src/ (menos los tests) para medir qué líneas se ejecutan
const instrumentador = createInstrumenter({ esModules: true, parserPlugins: ['jsx'] })
const cobertura = {
  name: 'cobertura',
  setup(build) {
    build.onLoad({ filter: /[\\/]src[\\/].*\.jsx?$/ }, (args) => {
      if (args.path.endsWith('.spec.js')) return
      const codigo = fs.readFileSync(args.path, 'utf8')
      return { contents: instrumentador.instrumentSync(codigo, args.path), loader: 'jsx' }
    })
  },
}

module.exports = function (config) {
  config.set({
    frameworks: ['jasmine'],
    plugins: ['karma-jasmine', 'karma-chrome-launcher', 'karma-esbuild', 'karma-coverage'],
    files: [
      'src/**/*.spec.js',
      // Las imágenes de public/ se sirven para que los tests no muestren 404
      { pattern: 'public/**/*', included: false, served: true, watched: false },
    ],
    proxies: { '/img/': '/base/public/img/' },
    preprocessors: { 'src/**/*.spec.js': ['esbuild'] },
    esbuild: { jsx: 'automatic', loader: { '.js': 'jsx' }, plugins: [cobertura] },
    reporters: ['progress', 'coverage'],
    coverageReporter: {
      dir: 'coverage',
      subdir: '.',
      reporters: [{ type: 'html' }, { type: 'text-summary' }, { type: 'json-summary' }],
    },
    browsers: ['ChromeHeadless'],
    singleRun: true,
  })
}
