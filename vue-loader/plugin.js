class VueLoaderPlugin {
  apply(compiler) {
    const rules = compiler.options.module.rules;
    const pitcher = {
      loader: require.resolve('./pitcher'),
      resourceQuery(query) {
        if (!query) return false
        const parsed = new URLSearchParams(query.slice(1))
        return parsed.get('vue') !== null
      }
    }
    const templateCompilerRule = {
      loader: require.resolve('./templateLoader'),
      resourceQuery(query) {
        if (!query) return false
        const parsed = new URLSearchParams(query.slice(1))
        return parsed.get('vue') !== null && parsed.get('type') === 'template'
      }
    }
    // 过滤vue-loader
    const vueRule = rules.find(rule => 'foo.vue'.match(rule.test))
    // 克隆所有规则，是为了处理style标签，因为style里的css代码，不是用vue-loader处理的，而且我们配置的css-loader
    // 所以需要拷贝 test: /.css/的规则。并且只处理包含vue的文件
    const cloneRules = rules.filter(rule => rule !== vueRule).map(cloneRule)
    compiler.options.module.rules = [pitcher, templateCompilerRule, ...cloneRules, ...rules]
  }
}
const ruleResource = (query, resource) => `${resource}.${query.get('lang')}`
let currnetResource
function cloneRule(rule) {
  const result = Object.assign(Object.assign({}, rule), {
    resource(r) {
      currnetResource = r
      return true
    },
    resourceQuery(query) {
      if (!query) return false
      const parsed = new URLSearchParams(query.slice(1))
      console.log("%c 🍩 parsed", "color:#ffdd4d", parsed);
      if (parsed.get('vue') === null) {
        return false
      }
      const fakeResourcePath = ruleResource(parsed, currnetResource)
      if (!fakeResourcePath.match(rule.test)) {
        return false
      }
      return true
    }
  })
  delete result.test
  return result
}

module.exports = VueLoaderPlugin