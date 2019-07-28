import {
  Values,
  FullyLoadedDeclaration,
  Page,
  Question,
} from './types/declaration'
import { getHidedElementCodes } from './getHidedElementCodes'
import { Statistics } from './index'

export default class PageKeeper {
  tabs: string[]
  pages: Page[]
  activePage: Page
  activeTab: string

  needStatement: boolean = false

  hidedPagesCodes: string[]
  visiblePages: Page[]
  activeQuestion: Question | undefined

  public processStatistics(statistics: Statistics) {
    const needStatement = statistics.payments_or_compensations.some(
      item => item.from > 0
    )
    if (needStatement !== this.needStatement) {
      this.needStatement = needStatement
      this.visiblePages = this.getVisiblePages()
    }
  }

  constructor(
    schema: FullyLoadedDeclaration,
    getValue: (code: string) => string
  ) {
    this.activeQuestion = undefined
    this.pages = schema.pages
    this.tabs = schema.pages
      .map(item => item.tab)
      .filter((value, index, arr) => arr.indexOf(value) === index)

    this.activePage = this.pages[0]
    this.activeTab = this.activePage.tab
    this.hidedPagesCodes = this.getHidedPagesCodes(getValue)
    this.visiblePages = this.getVisiblePages()
  }

  setActiveQuestion = (question: Question) => {
    this.activeQuestion = question
  }

  getActiveQuestion = () => this.activeQuestion

  setActivePage = (page: Page) => {
    if (this.activePage === page) {
      return
    }
    this.activeQuestion = undefined
    this.activePage = page
    this.activeTab = page.tab
  }

  setActiveTab = (tab: string) => {
    this.activeTab = tab
    const titlePage = this.getTitlePage(tab)
    if (titlePage && titlePage !== this.activePage) {
      this.activePage = titlePage
      this.activeQuestion = undefined
    }
  }

  getTitlePage = (tab: string) =>
    this.pages.find(item => item.tab === tab && item.is_title)

  isActiveTab = (tab: string) => this.activeTab === tab
  isActivePage = (page: Page) => this.activePage.id === page.id

  getActiveTab = () => this.activeTab
  getActivePage = () => this.activePage

  canGoToNextPage = () => {
    return (
      this.visiblePages.indexOf(this.activePage) !==
      this.visiblePages.length - 1
    )
  }

  canGoToPrevPage = () => {
    return this.visiblePages.indexOf(this.activePage) !== 0
  }

  getNextPage = () => {
    if (!this.canGoToNextPage()) {
      return undefined
    }
    const currentIndex = this.visiblePages.indexOf(this.activePage)
    return this.visiblePages[currentIndex + 1]
  }

  getPrevPage = () => {
    if (!this.canGoToPrevPage()) {
      return undefined
    }
    const currentIndex = this.visiblePages.indexOf(this.activePage)
    return this.visiblePages[currentIndex - 1]
  }

  private getVisiblePages = () =>
    this.pages
      .filter(item => !this.hidedPagesCodes.includes(item.code))
      .filter(item => item.type !== 'statement' || this.needStatement)

  processChangeValue = (
    questionCode: string,
    getValue: (code: string) => string
  ) => {
    // TODO:: проверить, нужно ли пересчитывать табы в зависимости от изменившегося вопроса
    this.hidedPagesCodes = this.getHidedPagesCodes(getValue)
    this.visiblePages = this.getVisiblePages()
  }

  private getHidedPagesCodes = (getValue: (code: string) => string) => {
    return this.pages.flatMap(page =>
      getHidedElementCodes(page.questions, getValue, () => '0', 'show_pages')
    )
  }
}
