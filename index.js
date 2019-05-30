const cheerio = require('cheerio')
const rp = require('request-promise')

const scrapper = {
  fetch(url) {
    return rp.get(url)
  },
  /** 
   * @param {String} url 
   * @param {ConfigurationItem[]} selectors
   * */
  async scrapUrl(url, selectors) {
    const html = await this.fetch(url)
    return this.scrap(html, selectors, {})
  },
  /** 
   * @param {String} html 
   * @param {ConfigurationItem[]} selectors
   * */
  scrap(html, selectors, objectToFill = {}) {
    selectors.map(selector => this.parseConfig(html, selector,objectToFill))
    return objectToFill
  },
  /**
   * 
   * @param {String} html 
   * @param {ConfigurationItem} configItem 
   */
  parseConfig(html, configItem, objectToFill = {}) {
    const $ = cheerio(html).find(configItem.value)
    if(configItem.attr) objectToFill[configItem.title] = $.attr(configItem.attr).trim()
    if(configItem.text) objectToFill[configItem.title] = $.text().trim()
    if(configItem.children) {
      objectToFill[configItem.title] = $
      .toArray()
      .map(el => {
        return this.scrap(cheerio.html(el), configItem.children, {})
        })
    }
    if(configItem.transform) objectToFill[configItem.title] = configItem.transform(objectToFill[configItem.title])
    if(configItem.html) objectToFill[configItem.title] = configItem.html($)
    return objectToFill
  }
}

module.exports = scrapper 