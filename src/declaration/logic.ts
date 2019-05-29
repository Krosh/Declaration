import { Question } from '../types/declaration'

type Values = { [key: string]: string }

export function getHidedQuestionCodes(
  questions: Question[],
  getValue: (code: string) => string,
  action: string
) {
  const hidedQuestions: string[] = []
  questions.forEach(question => {
    if (question.type === 'radio' || question.type === 'select') {
      const currentHide: string[] = question.answers.flatMap(item =>
        !!item.action &&
        item.action.type === action &&
        item.code !== getValue(question.code)
          ? item.action.codes
          : []
      )
      hidedQuestions.push(...currentHide)
    }
  })
  return hidedQuestions
}

export function getVisibleQuestions(
  questions: Question[],
  getValue: (code: string, id: number) => string,
  id: number
) {
  const action = 'show_inputs'
  const myGetValue = (code: string) => getValue(code, id)
  const hidedQuestions = getHidedQuestionCodes(questions, myGetValue, action)

  return questions.filter(question => !hidedQuestions.includes(question.code))
}
