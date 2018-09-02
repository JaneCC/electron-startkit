const context = require('./context')
const controller = require('./controller')
const raw = require('./raw')

const loaderMap = {
  context,
  controller,
  raw,
}

const addLoader = (name, loader) => {
  if (loaderMap[name]) {
    throw new Error(name + ' loader is already defined.')
  }

  loaderMap[name] = loader
}

/**
 * add new loader
 */
module.exports = app => type => (collect, name) => {
  let loader = loaderMap[type]
  if (!loader) {
    throw new Error(type + ' loader not found.')
  }

  loader = loader(app)

  let result = null
  if (!collect) {
    throw new Error('loader collect invalid')
  } else if(typeof collect === 'function') {
    result = loader(collect)
  } else if(typeof collect === 'object') {
    result = {}
    for(let [key, val] of Object.entries(collect)) {
      result[key] = loader(val)
    }
  } else {
    result = collect
  }

  app.$set(name, result) 
}

module.exports.addLoader = addLoader