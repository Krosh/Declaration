import * as React from 'react'
import { FullyLoadedDeclaration, Page, Question } from '../types/declaration'
import createValidator from '../types/validation'
import Joi from 'joi'

interface Props {
  schema: FullyLoadedDeclaration
  deleteMultiple: (questionCode: string, id: number) => void
  copyMultiple: (questionCode: string, id: number, newId: number) => void
  saveAnswer: (questionCode: string, id: number, value: string) => void
  initialValues: Values
  children: (props: Output) => JSX.Element
}

interface Output {
  deleteMultiple: (questionCode: string, id: number) => void
  copyMultiple: (questionCode: string, id: number) => void
  addMultiple: (questionCode: string, timestamp: number) => void
  getValue: (questionCode: string, id: number | undefined) => string
  setValue: (questionCode: string, id: number, value: string) => void
  values: Values
  questionsMap: QuestionsMap
  getQuestionErrors: (questionCode: string, questionId: number) => string[]
  setTouch: (questionCode: string, id: number, value?: boolean) => void
}

type QuestionsMap = { [key: string]: Question }

type Values = { [key: string]: { [id: number]: string } }
type Touches = { [key: string]: { [id: number]: boolean } }

interface State {
  touches: Touches
  values: Values
  questionsMap: QuestionsMap
  questionsValidators: { [key: string]: Joi.Schema }
}

const createTouches = (values: Values) => {
  const result: Touches = {}
  for (let key in values) {
    result[key] = {}
    for (let id in values[key]) {
      result[key][id] = !!values[key][id]
    }
  }
  return result
}

export default class FormDataKeeper extends React.Component<Props, State> {
  calculateQuestionsMap = (schema: FullyLoadedDeclaration) => {
    const getQuestions = (question: any) => {
      if (question.answers) {
        return [question, ...question.answers.map(getQuestions)].flat()
      }
      return [question]
    }

    return schema.pages.reduce((tot: QuestionsMap, cur: Page) => {
      cur.questions
        .map(getQuestions)
        .flat()
        .forEach(item => (tot[item.code] = item))
      return tot
    }, {})
  }

  constructor(props: Props) {
    super(props)
    const questionsMap = this.calculateQuestionsMap(props.schema)

    this.state = {
      values: this.props.initialValues,
      questionsMap: questionsMap,
      questionsValidators: createValidator(questionsMap),
      touches: createTouches(this.props.initialValues),
    }
  }

  setTouch = (questionCode: string, id: number, value?: boolean) => {
    let realValue = undefined === value ? true : value
    if (
      this.state.touches[questionCode] &&
      this.state.touches[questionCode][id] === realValue
    ) {
      return
    }
    this.setState(prevState => {
      const values = prevState.touches[questionCode]
      const newTouchValue = { ...values, [id]: realValue }
      return {
        ...prevState,
        touches: {
          ...prevState.touches,
          [questionCode]: newTouchValue,
        },
      }
    })
  }

  setValue = (questionCode: string, id: number, value: string) => {
    if (this.getValue(questionCode, id) === value) {
      return
    }
    this.setState(prevState => {
      const values = prevState.values[questionCode]
      const newQuestionValue = { ...values, [id]: value }
      return {
        ...prevState,
        values: {
          ...prevState.values,
          [questionCode]: newQuestionValue,
        },
      }
    })
    this.props.saveAnswer(questionCode, id, value)
  }

  getAllValues = (questionCode: string) => {
    return this.state.values[questionCode]
  }

  getValue = (questionCode: string, id: number | undefined) => {
    const questionMap = this.getAllValues(questionCode)
    if (!questionMap) {
      return ''
    }
    if (undefined !== id) {
      return questionMap[id] || ''
    }
    return Object.keys(questionMap).join(',')
  }

  addMultiple = (questionCode: string, timestamp: number) => {
    this.setValue(questionCode, timestamp, timestamp.toString())
  }

  deleteMultiple = (questionCode: string, id: number) => {
    const newQuestionValues = this.state.values[questionCode]
    delete newQuestionValues[id]
    this.setState(prevState => {
      return {
        ...prevState,
        values: {
          ...prevState.values,
          [questionCode]: newQuestionValues,
        },
      }
    })

    this.props.deleteMultiple(questionCode, id)
  }

  getQuestionErrors = (questionCode: string, id: number): string[] => {
    if (
      !this.state.touches[questionCode] ||
      !this.state.touches[questionCode][id]
    ) {
      return []
    }
    const validator = this.state.questionsValidators[questionCode]
    const data = Joi.validate(this.getValue(questionCode, id), validator)
    console.log('validate', this.state.questionsValidators, questionCode, data)
    return data.error ? data.error.details.map(item => item.message) : []
  }

  copyMultiple = (questionCode: string, id: number) => {
    const newId = new Date().valueOf()
    const newValues = { ...this.state.values }
    Object.keys(newValues).forEach(key => {
      if (newValues[key] && undefined !== newValues[key][id]) {
        newValues[key][newId] = newValues[key][id]
        if (key === questionCode) {
          newValues[key][newId] = newId.toString()
        }
      }
    })
    this.setState(prevState => {
      return {
        ...prevState,
        values: newValues,
      }
    })
    this.props.copyMultiple(questionCode, id, newId)
  }

  public render() {
    return this.props.children({
      deleteMultiple: this.deleteMultiple,
      copyMultiple: this.copyMultiple,
      addMultiple: this.addMultiple,
      getValue: this.getValue,
      setValue: this.setValue,
      getQuestionErrors: this.getQuestionErrors,
      setTouch: this.setTouch,
      ...this.state,
    })
  }
}
