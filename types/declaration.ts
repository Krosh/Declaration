export type Action = ShowInputsAction | ShowPagesAction

export type ShowInputsAction = {
  type: 'show_inputs'
  codes: string[]
}

export type ShowPagesAction = {
  type: 'show_pages'
  codes: string[]
}

export type AutocompleteAction = {
  action_type: string
  url: string
}

export type CurrencyAutocompleteAction = AutocompleteAction & {
  value_action: Action
}

interface BaseQuestion {
  name: string
  hint: string
  code: string
  parent_code?: string | null
}

export interface TextQuestion extends BaseQuestion {
  type: 'text'
}

export interface AutocompleteQuestion extends BaseQuestion {
  type: 'autocomplete'
  action: AutocompleteAction
}
export interface CurrencyAutocompleteQuestion extends BaseQuestion {
  type: 'currency_autocomplete'
  action: CurrencyAutocompleteAction
  needHideElements?: boolean
}

export interface AddressQuestion extends BaseQuestion {
  type: 'address'
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

export interface SharesQuestion extends BaseQuestion {
  type: 'shares'
}
export interface MoneyIntegerQuestion extends BaseQuestion {
  type: 'money_integer'
}

export type SingleQuestion =
  | TextQuestion
  | AutocompleteQuestion
  | CurrencyAutocompleteQuestion
  | AddressQuestion
  | PhoneQuestion
  | NumberQuestion
  | RadioQuestion
  | DateQuestion
  | SelectQuestion
  | CheckboxQuestion
  | MoneyQuestion
  | MoneyIntegerQuestion
  | SharesQuestion
  | InfoQuestion

export type Question = SingleQuestion | MultipleQuestion

export type QuestionWithAction = {
  action?: Action
  code: string
}

export interface Page {
  name: string
  code: string
  tab: string
  id: number
  questions: Question[]
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
  const parseActions = (item: any) => {
    if (item.action) {
      item.action = JSON.parse(item.action)
    }
    if (item.answers) {
      item.answers.forEach((answer: any) => {
        parseActions(answer)
      })
    }
  }

  data.pages.forEach((page: any) => {
    page.questions.forEach(parseActions)
  })

  return data
}

export type Values = { [key: string]: { [id: number]: string } }
