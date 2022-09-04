const { stringifyRequest } = require("./utils")

const pitcher = code => code

const isNotPitcher = loader => loader.path !== __filename
const stylePostLoaderPath = require.resolve('./stylePostLoader')
const isCssLoader = loader => /css-loader/.test(loader.path)
const pitch = function() {
  const loaderContext = this
  // 过滤掉自己
  const loaders = loaderContext.loaders.filter(isNotPitcher)

  const query = new URLSearchParams(loaderContext.resourceQuery.slice(1))

  if (query.get('type') === 'style') {
    const cssLoaderIndex = loaders.findIndex(isCssLoader)
    return genProxyModule([
      ...loaders.slice(0, cssLoaderIndex + 1),
      stylePostLoaderPath,
      ...loaders.slice(cssLoaderIndex + 1)
    ], loaderContext)
  }
  return genProxyModule(loaders, loaderContext, query.get('type') !== 'template')
}

function genProxyModule(loaders, loaderContext, exportDefault = true) {
  const request = genRequest(loaders, loaderContext)

  return exportDefault ? `export { default } from ${request}` : `export * from ${request}`
}

function genRequest(loaders, loaderContext) {
  const loaderStrings = loaders.map(loader => loader.request || loader)
  const resource = loaderContext.resourcePath + loaderContext.resourceQuery
  
  // loaderStrings 已经包含了所有loader, 不需要普通和前置Loader了, 还需要排除pitch loader，所以要加-!
  return stringifyRequest(loaderContext, '-!' + [...loaderStrings, resource].join('!'), '')
}

pitcher.pitch = pitch
module.exports = pitcher