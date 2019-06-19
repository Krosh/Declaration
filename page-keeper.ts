import {
  Values,
  FullyLoadedDeclaration,
  Page,
  Question,
} from './types/declaration'
import { getHidedElementCodes } from './getHidedElementCodes'

export default class PageKeeper {
  tabs: string[]
  pages: Page[]
  activePage: Page
  activeTab: string

  hidedPagesCodes: string[]
  visiblePages: Page[]
  activeQuestion: Question | undefined

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
    if (this.activeTab === tab) {
      return
    }
    this.activeTab = tab
    const titlePage = this.getTitlePage(tab)
    if (titlePage) {
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
