const scrapper = require('.')
const {expect} = require('chai')
const cheerio = require('cheerio')
const chai = require('chai')
const chaiJestDiff = require('chai-jest-diff').default

chai.use(chaiJestDiff())

describe('#parseConfig', function() {
  it('should return value from attribute', async function() {
    /**@type {ConfigurationItem} */
    const mockConfig = {
      title: 'test',
      attr: 'unit-test',
      value: '.unit-selector'
    }
    const mockWebsite = '<div><div class="unit-selector" unit-test="unit-value"></div></div>'
    const a = scrapper.parseConfig(mockWebsite, mockConfig, {})
    expect(a).to.be.deep.equal({ test: 'unit-value' })
  })
  it('should return value from innerText', async function() {
    /**@type {ConfigurationItem} */
    const mockConfig = {
      title: 'test',
      text: true,
      value: '.unit-selector'
    }
    const mockWebsite = '<div><div class="unit-selector">unit-value</div></div>'
    const a = scrapper.parseConfig(mockWebsite, mockConfig, {})
    expect(a).to.be.deep.equal({ test: 'unit-value' })
  })

  it('should transform result through function', async function() {
    /**@type {ConfigurationItem} */
    const mockConfig = {
      title: 'test',
      text: true,
      value: '.unit-selector',
      transform: value => +value
    }
    const mockWebsite = '<div><div class="unit-selector">3</div></div>'
    const a = scrapper.parseConfig(mockWebsite, mockConfig, {})
    expect(a).to.be.deep.equal({ test: 3 })
  })

  it('should transform result through function with html', async function() {
    /**@type {ConfigurationItem} */
    const mockConfig = {
      title: 'test',
      text: true,
      value: '.unit-selector',
      html: value => +value.find('.unit-sub-selector').text()
    }
    const mockWebsite = '<div><div class="unit-selector"><div class="unit-sub-selector">3</div></div></div></div>'
    const a = scrapper.parseConfig(mockWebsite, mockConfig, {})
    expect(a).to.be.deep.equal({ test: 3 })
  })
  it('should get all children recursively', async function() {
    /**@type {ConfigurationItem} */
    const mockConfig = {
      title: 'test',
      value: '.unit-selector',
      children: [
        {title: 'title', value: '.unit-sub-selector-title', text: true},
        {title: 'value', value: '.unit-sub-selector-value', text: true, transform: value => +value},
      ]
    }
    const mockWebsite = `
    <div>
      <div class="unit-selector">
        <div class="unit-sub-selector-title">Title 1</div>
        <div class="unit-sub-selector-value">1</div>
      </div>
      <div class="unit-selector">
        <div class="unit-sub-selector-title">Title 2</div>
        <div class="unit-sub-selector-value">2</div>
      </div>
    </div>`
    const a = scrapper.parseConfig(mockWebsite, mockConfig, {})
    expect(a).to.be.deep.equal({ 
      test: [
        {title: 'Title 1', value: 1},
        {title: 'Title 2', value: 2},
      ]
    })
  })
})
describe('#scrapper', function() {
  it('should scrap html from config', async function() {
    /**@type {ConfigurationItem[]} */
    const mockConfig = [{
      title: 'test',
      value: '.unit-selector',
      children: [
        {title: 'title', value: '.unit-sub-selector-title', text: true},
        {title: 'value', value: '.unit-sub-selector-value', text: true, transform: value => +value},
      ]
    },{
      title: 'title',
      value: '.unit-selector-test',
      text: true
    }]
    const mockWebsite = `
    <div>
      <div class="unit-selector-test">
        test
      </div>
      <div class="unit-selector">
        <div class="unit-sub-selector-title">Title 1</div>
        <div class="unit-sub-selector-value">1</div>
      </div>
      <div class="unit-selector">
        <div class="unit-sub-selector-title">Title 2</div>
        <div class="unit-sub-selector-value">2</div>
      </div>
    </div>`
    const a = scrapper.scrap(mockWebsite, mockConfig, {})
    expect(a).to.be.deep.equal({
      title: 'test',
      test: [
        {title: 'Title 1', value: 1},
        {title: 'Title 2', value: 2},
      ]
    })
  })
})