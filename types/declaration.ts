export interface Validation {
  shortAnswer?: boolean
  maxLength?: number
  canBeSkipped?: boolean
  oneOf?: string[]
  bikName?: string
  type?:
    | 'inn'
    | 'kpp'
    | 'oktmo'
    | 'year'
    | 'phone'
    | 'okved'
    | 'passport'
    | 'bik'
    | 'correspondent_account'
    | 'client_account'
}

export type Action =
  | ShowInputsAction
  | ShowPagesAction
  | EnableRequiredAction
  | ForceValuesAction

export type ShowInputsAction = {
  type: 'show_inputs'
  codes: string[]
}

export type ForceValuesAction = {
  type: 'force_values'
  value: string
  data: { [questionCode: string]: string }
}

export type ShowPagesAction = {
  type: 'show_pages'
  codes: string[]
}

export type EnableRequiredAction = {
  type: 'enable_required'
  codes: string[]
}

export type AutocompleteAction = {
  action_type: string
  url: string
}

export type CurrencyAutocompleteAction = AutocompleteAction & {
  value_action: { [key: string]: Action }
}

interface BaseQuestion {
  title_type?: string
  name: string
  hint: string
  code: string
  page: Page
  parent_code?: string | null
  validation?: Validation
}

export interface TextQuestion extends BaseQuestion {
  type: 'text'
}

export interface AutocompleteQuestion extends BaseQuestion {
  type: 'autocomplete'
  action: AutocompleteAction
}
export interface AutocompleteWithActions extends BaseQuestion {
  type: 'autocomplete_with_actions'
  action: CurrencyAutocompleteAction
  activeValueAction?: string
}

export interface AddressQuestion extends BaseQuestion {
  type: 'address'
  validation?: Validation
}

export interface InfoQuestion extends BaseQuestion {
  type: 'info'
}

export interface DateQuestion extends BaseQuestion {
  type: 'date'
}

export interface PhoneQuestion extends BaseQuestion {
  type: 'phone'
}

export interface OkvedQuestion extends BaseQuestion {
  type: 'okved'
}

export interface PassportQuestion extends BaseQuestion {
  type: 'passport'
}

export interface AnswerQuestion extends BaseQuestion {
  action?: Action
}

export interface MultipleQuestion extends BaseQuestion {
  type: 'multiple'
  answers: SingleQuestion[]
}

export interface RadioQuestion extends BaseQuestion {
  type: 'radio'
  answers: AnswerQuestion[]
  action?: ForceValuesAction
}

export interface CheckboxQuestion extends BaseQuestion {
  type: 'checkbox'
  action?: Action
}

export interface SelectQuestion extends BaseQuestion {
  type: 'select'
  answers: AnswerQuestion[]
}

export interface NumberQuestion extends BaseQuestion {
  type: 'number'
}

export interface MoneyQuestion extends BaseQuestion {
  type: 'money'
}
export interface MoneyAbroadQuestion extends BaseQuestion {
  type: 'money_abroad'
}
export interface MoneyCourseQuestion extends BaseQuestion {
  type: 'money_course'
}

export interface SharesQuestion extends BaseQuestion {
  type: 'shares'
}
export interface MoneyIntegerQuestion extends BaseQuestion {
  type: 'money_integer'
}

export type SingleQuestion =
  | TextQuestion
  | AutocompleteQuestion
  | AutocompleteWithActions
  | AddressQuestion
  | PhoneQuestion
  | NumberQuestion
  | RadioQuestion
  | DateQuestion
  | SelectQuestion
  | CheckboxQuestion
  | MoneyQuestion
  | OkvedQuestion
  | PassportQuestion
  | MoneyAbroadQuestion
  | MoneyCourseQuestion
  | MoneyIntegerQuestion
  | SharesQuestion
  | InfoQuestion

export type Question = SingleQuestion | MultipleQuestion

export type QuestionHasAction<A extends Action> = Question & { action: A }

export type QuestionWithAction = {
  action?: Action
  code: string
}

export interface Page {
  name: string
  code: string
  tab: string
  type?: 'income' | 'deduction' | 'statement' | 'total' | 'files' | 'download'
  id: number
  questions: Question[]
  is_title: boolean
}

export interface Declaration {
  name: string
  id: number
  code: string
}

export interface FullyLoadedDeclaration extends Declaration {
  pages: Page[]
}

export function processAnswers(answers: any) {
  return Object.keys(answers).reduce(
    (tot, key) => {
      tot[key] = { ...answers[key] }
      return tot
    },
    {} as any
  )
}

export function processData(data: any) {
  const parseActions = (item: any, page: Page) => {
    item.page = page
    if (item.action && typeof item.action === 'string') {
      item.action = JSON.parse(item.action)
    }
    if (item.validation && typeof item.validation === 'string') {
      item.validation = JSON.parse(item.validation)
    }
    if (item.answers) {
      item.answers.forEach((answer: any) => {
        parseActions(answer, page)
      })
    }
  }

  data.pages.forEach((page: any) => {
    page.questions.forEach((item: any) => parseActions(item, page))
  })

  return data
}

export type Values = { [key: string]: { [id: number]: string } }
