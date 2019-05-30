declare type  Configuration = {
  selectors?: ConfigurationItem[]
}

declare type ConfigurationItem = {
  title?: string,
  value?: string,
  text?: boolean,
  attr?: string
  children?: ConfigurationItem[],
  transform?: TransformFunction,
  html?: HtmlFunction
}

declare type HtmlFunction = (value: Cheerio) => string | number
declare type TransformFunction = (value: string) => string | number