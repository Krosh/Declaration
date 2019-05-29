import * as React from 'react'
import {
  CurrencyAutocompleteQuestion,
  FullyLoadedDeclaration,
  Page,
  Question,
  QuestionWithAction,
} from '../types/declaration'

export interface ValuesActions {
  addMultiple: (questionCode: string, timestamp: number) => void
  filterMultipleChilds: (
    questions: Question[],
    multipleQuestionId: number
  ) => Question[]
  deleteMultiple: (questionCode: string, id: number) => void
  copyMultiple: (questionCode: string, id: number) => void
  hideCurrencyCourseInput: (
    question: CurrencyAutocompleteQuestion,
    needHide: boolean
  ) => void
  getValue: (questionCode: string, id: number | undefined) => string
  setValue: (questionCode: string, id: number, value: string) => void
  getQuestionErrors: (questionCode: string, id: number) => string[]
  getPageErrors: (code: string) => string[]
  setTouch: (questionCode: string, id: number, value?: boolean) => void
}
export interface DeclarationFormProps extends ValuesActions {
  pages: Page[]
  tabs: string[]
  isActiveTab: (tab: string) => boolean
  setActiveTab: (tab: string) => void
  questions: Question[]
  setActivePage: (page: Page) => void
  isActivePage: (page: Page) => boolean
}

interface Props {
  schema: FullyLoadedDeclaration
  isActiveTab: (tab: string) => boolean
  setActiveTab: (tab: string) => void
  setActivePage: (page: Page) => void
  isActivePage: (page: Page) => boolean
  addMultiple: (questionCode: string, timestamp: number) => void
  deleteMultiple: (questionCode: string, id: number) => void
  copyMultiple: (questionCode: string, id: number) => void
  getValue: (questionCode: string, id: number | undefined) => string
  setValue: (questionCode: string, id: number, value: string) => void
  values: Values
  questionsMap: QuestionsMap
  children: (item: DeclarationFormProps) => JSX.Element
  setTouch: (questionCode: string, id: number, value?: boolean) => void
  getQuestionErrors: (questionCode: string, id: number) => string[]
}

type QuestionsMap = { [key: string]: Question }

type Values = { [key: string]: { [id: number]: string } }

const processAnswers = (
  questionsWithAction: QuestionWithAction[],
  value: string,
  action: string
) => {
  let hided = questionsWithAction
    .filter(answer => answer.action && answer.action.type === action)
    .map(answer => answer.action!.codes)
    .reduce((tot, cur) => [...tot, ...cur], [])

  if (value) {
    const answer = questionsWithAction.find(item => item.code === value)
    if (answer && answer.action && answer.action.type === action) {
      hided = hided.filter(
        hidedAnswer => !answer.action!.codes.includes(hidedAnswer)
      )
    }
  }

  return hided
}

const getHidedElements = (
  questions: Question[],
  values: Values,
  action: string,
  id: number
) => {
  const hidedElements: string[] = []
  questions.forEach(item => {
    if (item.type === 'multiple') {
      hidedElements.push(...getHidedElements(item.answers, values, action, id))
    }
    if (
      (item.type === 'radio' || item.type === 'select') &&
      item.answers.some(item => !!item.action && item.action.type === action)
    ) {
      hidedElements.push(
        ...processAnswers(
          item.answers,
          values[item.code] ? values[item.code][id] : '',
          action
        )
      )
    }
    if (item.type === 'currency_autocomplete' && item.action.value_action) {
      hidedElements.push(
        ...processAnswers(
          [
            {
              ...item,
              action: item.action.value_action,
            },
          ],
          !item.needHideElements ? item.code : '',
          action
        )
      )
    }

    if (item.type === 'checkbox' && item.action) {
      hidedElements.push(
        ...processAnswers(
          [item],
          values[item.code] && values[item.code][id] === '1' ? item.code : '',
          action
        )
      )
    }
  })

  return hidedElements
}

const processQuestionList = (actionType: string) => (
  questionsForFilter: Question[],
  questionsMap: QuestionsMap,
  values: Values,
  id: number = 0
) => {
  // TODO:: memoize
  const hidedQuestions = getHidedElements(
    Object.values(questionsMap),
    values,
    actionType,
    id
  )

  const totalHideQuestions: string[] = []
  while (hidedQuestions.length > 0) {
    const questionCode = hidedQuestions.pop() as string
    totalHideQuestions.push(questionCode)
    const question = questionsMap[questionCode]
    if (!question || question.type !== 'radio') {
      continue
    }
    const childQuestionsNeededToHide = question.answers
      .filter(item => !!item.action && item.action.type === actionType)
      .map(item => item.action!.codes)
      .reduce((tot, cur) => [...tot, ...cur], [])
    hidedQuestions.push(...childQuestionsNeededToHide)
  }

  return questionsForFilter.filter(
    item => !totalHideQuestions.includes(item.code)
  )
}

const getVisibleQuestions = processQuestionList('show_inputs')
const getRequiredQuestions = processQuestionList('enable_required')

const calculatePageList = (
  pages: Page[],
  questionsMap: QuestionsMap,
  values: Values,
  activeTab: string,
  id: number = 0
) => {
  const hidedPages = getHidedElements(
    Object.values(questionsMap),
    values,
    'show_pages',
    id
  )

  return pages
    .filter(item => !hidedPages.includes(item.code))
    .filter(item => item.tab === activeTab)
}
export default class RendererComponent extends React.Component<Props> {
  hideCurrencyCourseInput = (
    question: CurrencyAutocompleteQuestion,
    needHide: boolean
  ) => {
    if (question.needHideElements != needHide) {
      question.needHideElements = needHide
      this.forceUpdate()
    }
  }

  filterMultipleChilds = (questions: Question[], multipleQuestionId: number) =>
    getVisibleQuestions(
      questions,
      this.props.questionsMap,
      this.props.values,
      multipleQuestionId
    )

  public render() {
    const activePage = this.props.schema.pages.find(this.props.isActivePage)
    const activeTab = this.props.schema.pages
      .map(item => item.tab)
      .find(this.props.isActiveTab)

    if (!activePage) {
      throw new Error('WTF')
    }
    const pages = calculatePageList(
      this.props.schema.pages,
      this.props.questionsMap,
      this.props.values,
      activeTab || ''
    )

    const questions = activePage
      ? getVisibleQuestions(
          activePage.questions,
          this.props.questionsMap,
          this.props.values
        )
      : []
    // TODO:: вынести в отдельный метод
    const tabs = this.props.schema.pages
      .map(item => item.tab)
      .filter(
        (cur: string, index: number, arr: string[]) =>
          arr.indexOf(cur) === index
      )

    const getQuestionErrors = (questionCode: string, id: number) => {
      const questions = getVisibleQuestions(
        activePage.questions,
        this.props.questionsMap,
        this.props.values
      )

      const isChildQuestion = !!(this.props.questionsMap[questionCode] as any)
        .parent_code

      let skipValidate = false
      if (isChildQuestion) {
        skipValidate = questions.some(question => {
          if (question.type !== 'multiple') {
            return false
          }
          const childQuestions = this.filterMultipleChilds(question.answers, id)

          return !getRequiredQuestions(
            childQuestions,
            this.props.questionsMap,
            this.props.values,
            id
          )
            .map(question => question.code)
            .includes(questionCode)
        })
      }
      return skipValidate ? [] : this.props.getQuestionErrors(questionCode, id)
    }

    const getPageErrors = (pageCode: string) => {
      const page = this.props.schema.pages.find(item => item.code === pageCode)
      if (!page) {
        throw new Error('Не нашел page')
      }
      const questions = getVisibleQuestions(
        page.questions,
        this.props.questionsMap,
        this.props.values
      )

      return questions.flatMap(question => {
        if (question.type === 'multiple') {
          const ids = this.props
            .getValue(question.code, undefined)
            .split(',')
            .map(item => parseInt(item, 10))

          return ids.flatMap(id => {
            const childQuestions = this.filterMultipleChilds(
              question.answers,
              id
            )

            const requiredQuestions = getRequiredQuestions(
              childQuestions,
              this.props.questionsMap,
              this.props.values,
              id
            ).map(question => question.code)

            console.log(requiredQuestions)

            return childQuestions
              .filter(childQuestion =>
                requiredQuestions.includes(childQuestion.code)
              )
              .flatMap(childQuestion =>
                this.props.getQuestionErrors(childQuestion.code, id)
              )
          })
        }
        return this.props.getQuestionErrors(question.code, 0)
      })
    }

    return this.props.children({
      ...this.props,
      tabs,
      filterMultipleChilds: this.filterMultipleChilds,
      pages,
      questions,
      getPageErrors,
      getQuestionErrors,
      hideCurrencyCourseInput: this.hideCurrencyCourseInput,
    })
  }
}
