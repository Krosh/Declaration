import {
  Question,
  QuestionHasAction,
  ForceValuesAction,
} from './types/declaration'
import {
  getVisibleQuestions,
  getRequiredQuestions,
} from './getVisibleQuestions'
import ValuesKeeper from './values-keeper'

export class VisibilityKeeper {
  private visibilityCache: { [key: string]: Question[] } = {}
  private requiredCache: { [key: string]: Question[] } = {}
  private questionsCanBeForced: string[]

  constructor(
    private valuesKeeper: ValuesKeeper,
    private questionsWithForceValues: {
      [key: string]: QuestionHasAction<ForceValuesAction>
    }
  ) {
    this.questionsCanBeForced = Object.values(questionsWithForceValues).flatMap(
      item => Object.keys(item.action.data)
    )
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

    this.visibilityCache[cacheName] = (getVisibleQuestions(
      filteredItems,
      this.valuesKeeper.getValue,
      this.valuesKeeper.getValueActionIndex,
      id
    ) as Question[]).filter(item => {
      if (!this.questionsCanBeForced.includes(item.code)) {
        return true
      }
      return !Object.values(this.questionsWithForceValues).some(
        questionsWithForce =>
          this.valuesKeeper.getValue(questionsWithForce.code) ===
            questionsWithForce.action.value &&
          Object.keys(questionsWithForce.action.data).includes(item.code)
      )
    })

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
      this.valuesKeeper.getValueActionIndex,
      id
    )

    return this.requiredCache[cacheName]
  }
}
