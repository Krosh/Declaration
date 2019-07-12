import {
  Question,
  RadioQuestion,
  SelectQuestion,
  CheckboxQuestion,
  AutocompleteWithActions,
  ShowInputsAction,
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

export function isAutocompleteWithActions(
  question: Question
): question is AutocompleteWithActions {
  return question.type === 'autocomplete_with_actions'
}

export function hasActions(question: Question): question is CheckboxQuestion {
  return question.type === 'checkbox' && !!question.action
}

export function hasForceValueAction(
  question: Question
): question is RadioQuestion {
  return question.type === 'radio' && !!question.action
}

export function getHidedElementCodes(
  questions: Question[],
  getValue: (code: string) => string,
  getAutocompleteValueActionIndex: (question: Question) => string | undefined,
  action: 'show_inputs' | 'show_pages' | 'enable_required'
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
          return !((activeAnswer.action as any) as ShowInputsAction).codes.includes(
            hide
          )
        })
      }

      hidedQuestions.push(...currentHide)
    }

    if (isAutocompleteWithActions(question) && question.action.value_action) {
      const actions = Object.values(question.action.value_action)
      let currentHide = actions.flatMap(function(item) {
        return item.type === action ? item.codes : []
      })

      const activeValueAction = getAutocompleteValueActionIndex(question)
      if (undefined !== activeValueAction) {
        const valueAction = question.action.value_action[activeValueAction]
        if (undefined !== valueAction && valueAction.type === action) {
          currentHide = currentHide.filter(hide => {
            return !valueAction.codes.includes(hide)
          })
        }
      }

      hidedQuestions.push(...currentHide)
    }
  })
  return hidedQuestions
}
