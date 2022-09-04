const compiler = require('vue/compiler-sfc')
const { stringifyRequest } = require('./utils')
const hash = require('hash-sum')

const VueLoaderPlugin = require('./plugin')
const select = require('./select')
function loader(source) {
  const { descriptor } = compiler.parse(source)
  const loaderContext = this;
  // 绝对路径
  // 路径参数
  const { resourcePath, resourceQuery } = loaderContext
  const rawQuery = resourceQuery.slice(1)
  const incompingQuery = new URLSearchParams(rawQuery)
  const code = []

  const { script, template, styles } = descriptor
  const id = hash(resourcePath)
  const hasScoped = styles.some(e => e.scoped)
  if (incompingQuery.get('type')) {
    return select.selectBlock(descriptor, id, loaderContext, incompingQuery)
  }

  if (script) {
    // 相对路径
    // contextify(/pwd)
    const query = `?vue&type=script&id=${id}&lang=js`
    const request = stringifyRequest(loaderContext, resourcePath,query)
    code.push(`import script from ${request}`)
  }
  if (template) {
    const query = `?vue&type=template&id=${id}&lang=js`
    const request = stringifyRequest(loaderContext, resourcePath,query)
    code.push(`import { render } from ${request}`)
  }

  if (styles.length > 0) {
    const scopedQuery = hasScoped ? `&scoped=true` : ''
    styles.forEach((style, index) => {
      const query = `?vue&type=style&index=${index}&id=${id}${scopedQuery}&lang=css`
      const request = stringifyRequest(loaderContext, resourcePath,query)
      code.push(`import ${request}`)
    })
  }

  if (hasScoped) {
    code.push(`script.__scopeId = "data-v-${id}"`)
  }
  code.push(`script.render = render`)
  code.push(`export default script`)
  return code.join('\n')
}

module.exports = loader

loader.VueLoaderPlugin = VueLoaderPlugin
