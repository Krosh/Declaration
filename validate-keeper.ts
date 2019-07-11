import ValuesKeeper from './values-keeper'
import { Question, Page } from './types/declaration'
import TouchKeeper from './touch-keeper'
import { VisibilityKeeper } from './visibility-keeper'
import validate from './validation'
import { AddressModel } from './types/address'

export default class ValidateKeeper {
  private valuesKeeper: ValuesKeeper
  private touchKeeper: TouchKeeper
  private visibilityKeeper: VisibilityKeeper
  private cache: { [key: string]: any } = {}

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
    if (question.type === 'info') {
      return []
    }
    if (question.type === 'multiple') {
      const ids = this.valuesKeeper.getMultipleIds(question.code)
      return ids.flatMap(id =>
        this.visibilityKeeper
          .getRequiredList(question.code, question.answers, id)
          .flatMap(item => this.validateQuestion(item, id))
      )
    }
    if (question.type === 'address') {
      return Object.values(
        AddressModel.validate(
          this.valuesKeeper.getValue(question.code, id),
          (code: string) => this.touchKeeper.getTouch(question.code + code, id),
          !!question.validation && !!question.validation.shortAnswer
        )
      ).flat()
    }
    if (!this.touchKeeper.getTouch(question.code, id)) {
      return []
    }
    const isRequiredFromAction = !!question.parent_code
      ? this.visibilityKeeper
          .getRequiredList(question.parent_code, [], id)
          .includes(question)
      : this.visibilityKeeper
          .getRequiredList(question.page.code, question.page.questions, 0)
          .includes(question)

    return validate(
      question.code,
      question.validation,
      (code: string) => this.valuesKeeper.getValue(code, id),
      isRequiredFromAction
    )
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
