import {
  Values,
  Question,
  ForceValuesAction,
  QuestionHasAction,
} from './types/declaration'
import { DataProvider } from '.'

export default class ValuesKeeper {
  private enabledCurrencies: { [key: string]: { [key: number]: boolean } }
  questionsCanBeForced: string[]

  constructor(
    private values: Values,
    private dataProvider: DataProvider,
    private questionsWithForceValues: {
      [key: string]: QuestionHasAction<ForceValuesAction>
    }
  ) {
    this.questionsCanBeForced = Object.values(questionsWithForceValues).flatMap(
      item => Object.keys(item.action.data)
    )
    this.enabledCurrencies = {}
  }

  processCurrencyQuestion = (
    question: Question,
    id: number,
    showCourseInput: boolean
  ) => {
    if (this.getCurrencyQuestion(question, id) === showCourseInput) {
      return false
    }
    this.enabledCurrencies[question.code] =
      this.enabledCurrencies[question.code] || {}
    this.enabledCurrencies[question.code][id] = showCourseInput
    return true
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
    if (this.questionsCanBeForced.includes(code)) {
      for (let questionCode of Object.keys(this.questionsWithForceValues)) {
        const action = this.questionsWithForceValues[questionCode].action
        if (
          // Смотрим только на переключатель на 0 уровне
          this.getValue(questionCode, 0) === action.value &&
          action.data[code] !== undefined
        ) {
          return action.data[code]
        }
      }
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
