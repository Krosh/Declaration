import { FullyLoadedDeclaration, Values } from '../types/declaration'
import ValuesKeeper from './values-keeper'
import PageKeeper from './page-keeper'

export interface DataProvider {
  saveAnswer: (questionCode: string, id: number, value: string) => void
  deleteMultiple: (questionCode: string, id: number) => void
  copyMultiple: (questionCode: string, id: number, newId: number) => void
}

export default class Declaration {
  schema: FullyLoadedDeclaration
  valuesKeeper: ValuesKeeper
  private pagesKeeper: PageKeeper
  dataProvider: DataProvider

  constructor(
    schema: FullyLoadedDeclaration,
    initialValues: Values,
    dataProvider: DataProvider
  ) {
    this.schema = schema
    this.valuesKeeper = new ValuesKeeper(initialValues)
    this.pagesKeeper = new PageKeeper(schema, this.valuesKeeper.getValue)
    this.dataProvider = dataProvider
  }

  setActivePage = this.pagesKeeper.setActivePage
  setActiveTab = this.pagesKeeper.setActiveTab

  isActiveTab = this.pagesKeeper.isActiveTab
  isActivePage = this.pagesKeeper.isActivePage

  getActiveTab = this.pagesKeeper.getActiveTab
  getActivePage = this.pagesKeeper.getActivePage

  getVisibleTabs = () => this.pagesKeeper.tabs
  getVisiblePages = () => this.pagesKeeper.visiblePages
}
