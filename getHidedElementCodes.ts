import {
  Question,
  RadioQuestion,
  SelectQuestion,
  CheckboxQuestion,
} from './types/declaration'

export function canHasActionsOnChild(
  question: Question
): question is RadioQuestion | SelectQuestion {
  return question.type === 'radio' || question.type === 'select'
}

export function hasActionsOnChild(question: Question) {
  return (
    canHasActionsOnChild(question) &&
    !!question.answers.find(item => !!item.action)
  )
}

export function hasActions(question: Question): question is CheckboxQuestion {
  return question.type === 'checkbox' && !!question.action
}

export function getHidedElementCodes(
  questions: Question[],
  getValue: (code: string) => string,
  getCurrencyNeedHideValue: (question: Question) => boolean,
  action: string
) {
  const hidedQuestions: string[] = []
  questions.forEach(question => {
    if (hasActions(question) && getValue(question.code) !== '1') {
      if (question.action && question.action.type === action) {
        hidedQuestions.push(...question.action.codes)
      }
    }

    // TODO:: tests
    if (canHasActionsOnChild(question)) {
      let currentHide = question.answers.flatMap(function(item) {
        return !!item.action && item.action.type === action
          ? item.action.codes
          : []
      })

      const activeAnswer = question.answers.find(
        item => item.code === getValue(question.code)
      )
      if (
        activeAnswer &&
        activeAnswer.action &&
        activeAnswer.action.type === action
      ) {
        currentHide = currentHide.filter(hide => {
          return !activeAnswer.action!.codes.includes(hide)
        })
      }

      hidedQuestions.push(...currentHide)
    }

    // TODO:: tests
    if (
      question.type === 'currency_autocomplete' &&
      question.action.value_action &&
      question.action.value_action.type === action &&
      getCurrencyNeedHideValue(question)
    ) {
      hidedQuestions.push(...question.action.value_action.codes)
    }
  })
  return hidedQuestions
}
