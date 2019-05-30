import { Values, FullyLoadedDeclaration, Page } from './types/declaration'
import { getHidedElementCodes } from './getHidedElementCodes'

export default class PageKeeper {
  tabs: string[]
  pages: Page[]
  activePage: Page
  activeTab: string

  hidedPagesCodes: string[]
  visiblePages: Page[]

  constructor(
    schema: FullyLoadedDeclaration,
    getValue: (code: string) => string
  ) {
    this.pages = schema.pages
    this.tabs = schema.pages
      .map(item => item.tab)
      .filter((value, index, arr) => arr.indexOf(value) === index)

    this.activePage = this.pages[0]
    this.activeTab = this.activePage.tab
    this.hidedPagesCodes = this.getHidedPagesCodes(getValue)
    this.visiblePages = this.getVisiblePages()
  }

  setActivePage = (page: Page) => {
    this.activePage = page
  }

  setActiveTab = (tab: string) => {
    this.activeTab = tab
  }

  isActiveTab = (tab: string) => this.activeTab === tab
  isActivePage = (page: Page) => this.activePage.id === page.id

  getActiveTab = () => this.activeTab
  getActivePage = () => this.activePage

  getVisiblePages = () =>
    this.pages.filter(item => !this.hidedPagesCodes.includes(item.code))

  processChangeValue = (
    questionCode: string,
    getValue: (code: string) => string
  ) => {
    // TODO:: проверить, нужно ли пересчитывать табы в зависимости от изменившегося вопроса
    this.hidedPagesCodes = this.getHidedPagesCodes(getValue)
    this.visiblePages = this.getVisiblePages()
  }

  getHidedPagesCodes = (getValue: (code: string) => string) => {
    return this.pages.flatMap(page =>
      getHidedElementCodes(page.questions, getValue, () => false, 'show_pages')
    )
  }
}
