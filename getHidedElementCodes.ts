import {
  Question,
  RadioQuestion,
  SelectQuestion,
  CheckboxQuestion,
} from '../types/declaration'

export function canHasActionsOnChild(
  question: Question
): question is RadioQuestion | SelectQuestion {
  return question.type === 'radio' || question.type === 'select'
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
      const currentHide: string[] = question.answers.flatMap(item =>
        !!item.action &&
        item.action.type === action &&
        item.code !== getValue(question.code)
          ? item.action.codes
          : []
      )
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
