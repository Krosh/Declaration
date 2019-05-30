import ValuesKeeper from './values-keeper'
import { Question, Page } from './types/declaration'
import TouchKeeper from './touch-keeper'
import { VisibilityKeeper } from './visibility-keeper'

export default class ValidateKeeper {
  private valuesKeeper: ValuesKeeper
  private touchKeeper: TouchKeeper
  private visibilityKeeper: VisibilityKeeper
  private cache: { [key: string]: string[] } = {}

  constructor(
    valuesKeeper: ValuesKeeper,
    touchKeeper: TouchKeeper,
    visibilityKeeper: VisibilityKeeper
  ) {
    this.valuesKeeper = valuesKeeper
    this.touchKeeper = touchKeeper
    this.visibilityKeeper = visibilityKeeper
  }

  private getErrors = (question: Question, id: number) => {
    if (question.type === 'multiple') {
      const requiredList = this.visibilityKeeper.getRequiredList(
        question.code,
        question.answers,
        id
      )
      const ids = this.valuesKeeper.getMultipleIds(question.code)
      return ids.flatMap(id =>
        this.visibilityKeeper
          .getRequiredList(question.code, question.answers, id)
          .flatMap(item => this.validateQuestion(item, id))
      )
    }
    if (!this.touchKeeper.getTouch(question.code, id)) {
      return []
    }
    if (
      question.parent_code &&
      !this.visibilityKeeper
        .getRequiredList(question.parent_code, [], id)
        .includes(question)
    ) {
      console.log(question.code, question.parent_code)
      return []
    }
    if (question.type === 'text') {
      return this.valuesKeeper.getValue(question.code, id) !== ''
        ? []
        : ['Не должен быть пустым']
    }
    return []
  }

  private getPageErrors = (page: Page) => {
    return this.visibilityKeeper
      .getList(page.code, page.questions, 0)
      .flatMap(item => this.validateQuestion(item, 0))
  }

  private getCacheName = (questionCode: string, id: number) =>
    questionCode + id.toString()

  refreshQuestionCache(question: Question, id: number) {
    this.cache = {}
    // delete this.cache[this.getCacheName(question.code, id)]
    // if (question.parent_code) {
    //   delete this.cache[this.getCacheName(question.parent_code, 0)]
    // }
  }

  validateQuestion(question: Question, id: number) {
    const cacheName = this.getCacheName(question.code, id)
    if (this.cache[cacheName]) {
      return this.cache[cacheName]
    }
    this.cache[cacheName] = this.getErrors(question, id)
    return this.cache[cacheName]
  }

  validatePage = (page: Page) => {
    // TODO:: cache it!
    return this.getPageErrors(page)
  }
}
