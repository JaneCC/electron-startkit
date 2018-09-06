/**
 * 先生成一个空的 object ，等到自动执行 init 的时候在拼好真实数据
 */
module.exports = context => (fn, name) => {
  const placeholder = {
    init() {
      delete this.init
      const config = fn(context)
      if (!config) {
        return
      }
      for (let [key, val] of Object.entries(config)) {
        if (key === 'data') {
          this[key] = val || {}
        } else if (typeof val === 'function') {
          this[key] = val.bind(this)
        } else {
          this[key] = val
        }
      }
      if (this.init) {
        this.init(this.$context)
      }
    }
  }
  return placeholder
}
