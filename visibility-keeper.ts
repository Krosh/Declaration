import { Question } from './types/declaration'
import {
  getVisibleQuestions,
  getRequiredQuestions,
} from './getVisibleQuestions'
import ValuesKeeper from './values-keeper'

export class VisibilityKeeper {
  private visibilityCache: { [key: string]: Question[] } = {}
  private requiredCache: { [key: string]: Question[] } = {}
  private valuesKeeper: ValuesKeeper

  constructor(valuesKeeper: ValuesKeeper) {
    this.valuesKeeper = valuesKeeper
  }

  clearVisibility() {
    console.log('visibility cache cleared')
    this.visibilityCache = {}
  }

  clearRequired() {
    console.log('required cache cleared')
    this.requiredCache = {}
  }

  getList(name: string, filteredItems: Question[], id: number) {
    const cacheName = name + id.toString()
    if (this.visibilityCache[cacheName]) {
      return this.visibilityCache[cacheName]
    }

    this.visibilityCache[cacheName] = getVisibleQuestions(
      filteredItems,
      this.valuesKeeper.getValue,
      this.valuesKeeper.getCurrencyQuestion,
      id
    ) as Question[]

    return this.visibilityCache[cacheName]
  }

  getRequiredList(name: string, filteredItems: Question[], id: number) {
    const cacheName = name + id.toString() + '-required'
    if (this.requiredCache[cacheName]) {
      return this.requiredCache[cacheName]
    }

    const requiredQuestions = this.getList(name, filteredItems, id)

    this.requiredCache[cacheName] = getRequiredQuestions(
      requiredQuestions,
      this.valuesKeeper.getValue,
      this.valuesKeeper.getCurrencyQuestion,
      id
    )

    return this.requiredCache[cacheName]
  }
}
