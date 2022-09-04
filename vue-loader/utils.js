function stringifyRequest(loaderContext, resourcePath, resourceQuery) {
  return JSON.stringify(
    loaderContext.utils.contextify(
      loaderContext.context,
      resourcePath + resourceQuery
    )
  )
}

exports.stringifyRequest = stringifyRequest