import { FullyLoadedDeclaration, Values } from '../types/declaration'
import ValuesKeeper from './values-keeper'
import PageKeeper from './page-keeper'

export interface DataProvider {
  saveAnswer: () => void
}

export default class Declaration {
  schema: FullyLoadedDeclaration
  valuesKeeper: ValuesKeeper
  pagesKeeper: PageKeeper

  constructor(
    schema: FullyLoadedDeclaration,
    initialValues: Values,
    dataProvider: DataProvider
  ) {
    this.schema = schema
    this.valuesKeeper = new ValuesKeeper(initialValues)
    this.pagesKeeper = new PageKeeper(schema, this.valuesKeeper.getValue)
  }
}
