const compiler = require('vue/compiler-sfc')
function templateLoader(source) {
  const loaderContext = this
  const query = new URLSearchParams(loaderContext.resourceQuery.slice(1))
  const scopeId = query.get('id')
  const { code } = compiler.compileTemplate({
    source,
    id: scopeId
  })
  loaderContext.callback(null, code)
}

module.exports = templateLoader