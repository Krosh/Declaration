import { Question } from './types/declaration'
import { getHidedElementCodes } from './getHidedElementCodes'

const getActionedQuestions = (action: 'show_inputs' | 'enable_required') => (
  questions: Question[],
  getValue: (code: string, id: number) => string,
  getCurrencyNeedHideValue: (quesiton: Question, id: number) => boolean,
  id: number
) => {
  const myGetValue = (code: string) => getValue(code, id)
  const myGetNeedHide = (question: Question) =>
    getCurrencyNeedHideValue(question, id)
  const hidedQuestions = getHidedElementCodes(
    questions,
    myGetValue,
    myGetNeedHide,
    action
  )

  return questions.filter(question => !hidedQuestions.includes(question.code))
}

export const getVisibleQuestions = getActionedQuestions('show_inputs')
export const getRequiredQuestions = getActionedQuestions('enable_required')
