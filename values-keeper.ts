import { Values, Question } from './types/declaration'
import { DataProvider } from '.'

export default class ValuesKeeper {
  private values: Values
  private dataProvider: DataProvider
  private enabledCurrencies: { [key: string]: { [key: number]: boolean } }

  constructor(initialValues: Values, dataProvider: DataProvider) {
    this.values = initialValues
    this.dataProvider = dataProvider
    this.enabledCurrencies = {}
  }

  processCurrencyQuestion = (
    question: Question,
    id: number,
    showCourseInput: boolean
  ) => {
    this.enabledCurrencies[question.code] =
      this.enabledCurrencies[question.code] || {}
    this.enabledCurrencies[question.code][id] = showCourseInput
  }

  getCurrencyQuestion = (question: Question, id: number) => {
    return this.enabledCurrencies[question.code]
      ? this.enabledCurrencies[question.code][id]
      : true
  }

  setValue = (code: string, id: number, newValue: string) => {
    if (this.getValue(code, id) === newValue) {
      return false
    }
    this.values[code] = this.values[code] || {}
    this.values[code][id] = newValue
    this.dataProvider.saveAnswer(code, id, newValue)
    return true
  }

  getMultipleIds = (code: string) => {
    if (!this.values[code]) {
      return []
    }
    return Object.keys(this.values[code]).map(key => parseInt(key, 10))
  }

  getValue = (code: string, id?: number) => {
    if (!id) {
      id = 0
    }
    if (!this.values[code] || !this.values[code][id]) {
      return ''
    }
    return this.values[code][id]
  }

  addMultiple = (questionCode: string, timestamp: number) => {
    this.setValue(questionCode, timestamp, timestamp.toString())
  }

  deleteMultiple = (questionCode: string, id: number) => {
    delete this.values[questionCode][id]
    this.dataProvider.deleteMultiple(questionCode, id)

    // this.props.deleteMultiple(questionCode, id)
  }

  copyMultiple = (questionCode: string, id: number) => {
    const newId = new Date().valueOf()
    const newValues = { ...this.values }
    Object.keys(newValues).forEach(key => {
      if (newValues[key] && undefined !== newValues[key][id]) {
        newValues[key][newId] = newValues[key][id]
        if (key === questionCode) {
          newValues[key][newId] = newId.toString()
        }
      }
    })
    this.values = newValues
    this.dataProvider.copyMultiple(questionCode, id, newId)
    // this.props.copyMultiple(questionCode, id, newId)
  }
}
