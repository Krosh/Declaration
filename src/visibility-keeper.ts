import { Question } from '../types/declaration'
import {
  getVisibleQuestions,
  getRequiredQuestions,
} from './getVisibleQuestions'
import ValuesKeeper from './values-keeper'

export class VisibilityKeeper {
  private cache: { [key: string]: Question[] } = {}
  private valuesKeeper: ValuesKeeper

  constructor(valuesKeeper: ValuesKeeper) {
    this.valuesKeeper = valuesKeeper
  }

  clear() {
    console.log('cache cleared')
    this.cache = {}
  }

  getList(name: string, filteredItems: Question[], id: number) {
    const cacheName = name + id.toString()
    if (this.cache[cacheName]) {
      return this.cache[cacheName]
    }

    this.cache[cacheName] = getVisibleQuestions(
      filteredItems,
      this.valuesKeeper.getValue,
      this.valuesKeeper.getCurrencyQuestion,
      id
    ) as Question[]

    return this.cache[cacheName]
  }

  getRequiredList(name: string, filteredItems: Question[], id: number) {
    const cacheName = name + id.toString() + '-required'
    if (this.cache[cacheName]) {
      return this.cache[cacheName]
    }

    const visibleQuestions = this.getList(name, filteredItems, id)

    this.cache[cacheName] = getRequiredQuestions(
      visibleQuestions,
      this.valuesKeeper.getValue,
      this.valuesKeeper.getCurrencyQuestion,
      id
    )

    return this.cache[cacheName]
  }
}
