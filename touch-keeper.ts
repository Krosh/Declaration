import { Page, Question } from './types/declaration'
import ValuesKeeper from './values-keeper'
import { AddressModel } from './types/address'

export default class TouchKeeper {
  private values: { [key: string]: { [id: number]: boolean } }

  valuesKeeper: ValuesKeeper

  constructor(valuesKeeper: ValuesKeeper) {
    this.values = {}
    this.valuesKeeper = valuesKeeper
  }

  touchAll = () => {
    this.getTouch = () => true
  }

  touchAllFromPage = (page: Page) => {
    const processTouches = (questions: Question[], id: number) => {
      questions.forEach(question => {
        if (question.type === 'multiple') {
          this.valuesKeeper
            .getMultipleIds(question.code)
            .forEach(multipleId => processTouches(question.answers, multipleId))
        } else if (question.type === 'address') {
          for (let key in AddressModel.create(null)) {
            this.setTouch(AddressModel.getFullCodeName(question, key), id, true)
          }
        } else {
          this.setTouch(question.code, id, true)
        }
      })
    }
    processTouches(page.questions, 0)
  }

  setTouch = (code: string, id: number, newValue: boolean) => {
    if (this.getTouch(code, id) === newValue) {
      return false
    }
    this.values[code] = this.values[code] || {}
    this.values[code][id] = newValue
    return true
  }

  getTouch = (code: string, id?: number) => {
    if (!id) {
      id = 0
    }
    if (!this.values[code] || !this.values[code][id]) {
      return false
    }
    return this.values[code][id]
  }
}
