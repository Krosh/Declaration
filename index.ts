import {
  canHasActionsOnChild,
  hasActions,
  hasActionsOnChild,
  canHasCurrencyActionsOnChild,
} from './getHidedElementCodes'
import PageKeeper from './page-keeper'
import TouchKeeper from './touch-keeper'
import {
  FullyLoadedDeclaration,
  MultipleQuestion,
  Page,
  Question,
  SingleQuestion,
  Values,
} from './types/declaration'
import ValidateKeeper from './validate-keeper'
import ValuesKeeper from './values-keeper'
import { VisibilityKeeper } from './visibility-keeper'

type QuestionsMap = { [key: string]: Question }

export interface DataProvider {
  saveAnswer: (questionCode: string, id: number, value: string) => void
  deleteMultiple: (questionCode: string, id: number) => void
  copyMultiple: (questionCode: string, id: number, newId: number) => void
}

export interface SingleQuestionProps {
  question: SingleQuestion
  value: string
  setValue: (newValue: string) => void
  errors: string[]
  setTouched: () => void
  declaration: Declaration
  setCourseInputVisibility: (needHideInput: boolean) => boolean
}

export interface MultipleQuestionProps {
  question: MultipleQuestion
  ids: number[]
  getQuestionProps: (question: Question, id: number) => QuestionProps
  addMultiple: (questionCode: string, timestamp: number) => void
  deleteMultiple: (questionCode: string, id: number) => void
  copyMultiple: (questionCode: string, id: number) => void
  filterMultipleChilds: (
    question: MultipleQuestion,
    id: number
  ) => SingleQuestion[]
}

export type QuestionProps = SingleQuestionProps | MultipleQuestionProps

export default class Declaration {
  private schema: FullyLoadedDeclaration
  private valuesKeeper: ValuesKeeper
  private pagesKeeper: PageKeeper
  private dataProvider: DataProvider
  private validateKeeper: ValidateKeeper

  isActiveTab: (tab: string) => boolean
  isActivePage: (page: Page) => boolean
  getActiveTab: () => string
  getActivePage: () => Page
  getVisibleTabs: () => string[]
  getVisiblePages: () => Page[]

  private rerenderCallback?: () => void
  private questionsMap: QuestionsMap
  private visibilityKeeper: VisibilityKeeper
  validatePage: (page: Page) => string[]
  private touchKeeper: TouchKeeper
  getMultipleIds: (code: string) => number[]

  constructor(
    schema: FullyLoadedDeclaration,
    initialValues: Values,
    dataProvider: DataProvider
  ) {
    this.schema = schema
    this.dataProvider = dataProvider
    this.questionsMap = this.calculateQuestionsMap(schema)
    this.processShowInputsActions(this.schema)
    this.valuesKeeper = new ValuesKeeper(initialValues, dataProvider)
    this.visibilityKeeper = new VisibilityKeeper(this.valuesKeeper)
    this.pagesKeeper = new PageKeeper(schema, this.valuesKeeper.getValue)
    this.touchKeeper = new TouchKeeper(this.valuesKeeper)
    this.validateKeeper = new ValidateKeeper(
      this.valuesKeeper,
      this.touchKeeper,
      this.visibilityKeeper
    )

    this.isActiveTab = this.pagesKeeper.isActiveTab
    this.isActivePage = this.pagesKeeper.isActivePage

    this.getActiveTab = this.pagesKeeper.getActiveTab
    this.getActivePage = this.pagesKeeper.getActivePage

    this.getVisibleTabs = () => this.pagesKeeper.tabs
    this.getVisiblePages = () => this.pagesKeeper.visiblePages
    this.getMultipleIds = this.valuesKeeper.getMultipleIds

    this.validatePage = this.validateKeeper.validatePage
  }

  processShowInputsActions = (schema: FullyLoadedDeclaration) => {
    const parseActions = (item: any) => {
      if (item.action && item.action.type === 'show_inputs') {
        const nonProcessedCodes: string[] = [...item.action.codes]
        const codes = []
        while (nonProcessedCodes.length) {
          const curCode = nonProcessedCodes.pop() as string
          if (!this.questionsMap[curCode]) {
            // Не нашли вопрос
            continue
          }
          codes.push(curCode)
          const curQuestion = this.questionsMap[curCode] as any
          if (canHasActionsOnChild(curQuestion)) {
            curQuestion.answers.forEach(answer => {
              if (answer.action && answer.action.type === 'show_inputs') {
                nonProcessedCodes.push(...answer.action.codes)
              }
            })
          }
        }
        item.action.codes = codes
      }
      if (item.answers) {
        item.answers.forEach((answer: any) => {
          parseActions(answer)
        })
      }
    }

    schema.pages.forEach(page => {
      page.questions.forEach(parseActions)
    })
  }

  calculateQuestionsMap = (schema: FullyLoadedDeclaration) => {
    const getQuestions = (question: any) => {
      if (question.answers) {
        return [question, ...question.answers.flatMap(getQuestions)]
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

  setRerenderCallback = (cb: () => void) => {
    this.rerenderCallback = cb
  }

  getVisibleQuestionFromPage = (page: Page) => {
    return this.visibilityKeeper.getList(page.code, page.questions, 0)
  }

  setActivePage = (page: Page) => {
    if (this.pagesKeeper.getActivePage() === page) {
      return
    }
    this.touchKeeper.touchAllFromPage(this.pagesKeeper.getActivePage())
    this.pagesKeeper.setActivePage(page)
    this.validateKeeper.refreshQuestionCache({} as any, 0) // TODO::сделать нормальным методом
    this.rerenderCallback && this.rerenderCallback()
  }

  setActiveTab = (tab: string) => {
    this.pagesKeeper.setActiveTab(tab)
    this.rerenderCallback && this.rerenderCallback()
  }

  filterMutlipleQuestionChilds = (
    multipleQuestion: MultipleQuestion,
    id: number
  ) => {
    return this.visibilityKeeper.getList(
      multipleQuestion.code,
      multipleQuestion.answers,
      id
    ) as SingleQuestion[]
  }

  getDefaultMutlipleQuestion = (page: Page) => {
    return page.questions.find(item => item.type === 'multiple')
  }

  isPageEmpty = (page: Page) => {
    const defaultQuestion = this.getDefaultMutlipleQuestion(page)
    if (!defaultQuestion) {
      return false
    }
    const ids = this.getMultipleIds(defaultQuestion.code)
    return ids.length === 0
  }

  getQuestionProps = (question: Question, id: number): QuestionProps => {
    if (question.type !== 'multiple') {
      return {
        question: question as any, // TODO
        value: this.valuesKeeper.getValue(question.code, id),
        setValue: newValue => {
          if (!this.valuesKeeper.setValue(question.code, id, newValue)) {
            return
          }
          this.pagesKeeper.processChangeValue(
            question.code,
            this.valuesKeeper.getValue
          )
          this.touchKeeper.setTouch(question.code, id, true)
          if (
            hasActions(question) ||
            hasActionsOnChild(question) ||
            canHasCurrencyActionsOnChild(question)
          ) {
            this.visibilityKeeper.clearVisibility()
          }
          this.visibilityKeeper.clearRequired()
          this.validateKeeper.refreshQuestionCache(question, id)
          this.rerenderCallback && this.rerenderCallback()
        },
        errors: this.validateKeeper.validateQuestion(question, id),
        setTouched: () => {
          if (!this.touchKeeper.setTouch(question.code, id, true)) {
            return
          }
          this.validateKeeper.refreshQuestionCache(question, id)
          this.rerenderCallback && this.rerenderCallback()
        }, // TODO
        setCourseInputVisibility: (needHide: boolean) =>
          this.valuesKeeper.processCurrencyQuestion(question, id, needHide),
        declaration: this,
      }
    } else {
      return {
        question: question as MultipleQuestion,
        ids: this.valuesKeeper.getMultipleIds(question.code),
        getQuestionProps: this.getQuestionProps,
        addMultiple: (code: string, timestamp: number) => {
          this.valuesKeeper.addMultiple(code, timestamp)
          this.validateKeeper.refreshQuestionCache(question, 0)
          this.rerenderCallback && this.rerenderCallback()
        },
        deleteMultiple: (code: string, timestamp: number) => {
          this.valuesKeeper.deleteMultiple(code, timestamp)
          this.validateKeeper.refreshQuestionCache(question, 0)
          this.rerenderCallback && this.rerenderCallback()
        },
        copyMultiple: (code: string, id: number) => {
          this.valuesKeeper.copyMultiple(code, id)
          this.rerenderCallback && this.rerenderCallback()
        },
        filterMultipleChilds: this.filterMutlipleQuestionChilds,
      }
    }
  }
}
