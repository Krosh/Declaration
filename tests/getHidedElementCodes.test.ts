import {
  Question,
  ShowInputsAction,
  AutocompleteWithActions,
} from '../types/declaration'
import { getVisibleQuestions } from '../getVisibleQuestions'
import { getHidedElementCodes } from '../getHidedElementCodes'

const getValue = (obj: any) => (code: string) => (obj[code] ? obj[code] : '')

test('simple select with action', () => {
  const mock: Question[] = [
    {
      type: 'select',
      name: '',
      code: 'q',
      hint: '',
      page: {} as any,
      answers: [
        {
          name: '',
          code: 'a1',
          page: {} as any,
          hint: '',
          action: {
            codes: ['2'],
            type: 'show_inputs',
          } as ShowInputsAction,
        },
        {
          name: '',
          code: 'a2',
          page: {} as any,
          hint: '',
          action: {
            codes: ['3'],
            type: 'show_inputs',
          } as ShowInputsAction,
        },
      ],
    },
    {
      type: 'text',
      name: '',
      page: {} as any,
      code: '2',
      hint: '',
    },
    {
      type: 'text',
      name: '',
      code: '3',
      page: {} as any,
      hint: '',
    },
  ]

  const filteredQuestionsWithA1 = getHidedElementCodes(
    mock,
    getValue({ q: 'a1' }),
    () => '',
    'show_inputs'
  )
  expect(filteredQuestionsWithA1).toHaveLength(1)
  expect(filteredQuestionsWithA1[0]).toBe('3')

  const filteredQuestionsWithA2 = getHidedElementCodes(
    mock,
    getValue({ q: 'a2' }),
    () => '',
    'show_inputs'
  )
  expect(filteredQuestionsWithA2).toHaveLength(1)
  expect(filteredQuestionsWithA2[0]).toBe('2')

  const filteredQuestionsWithoutAnswer = getHidedElementCodes(
    mock,
    getValue({}),
    () => '',
    'show_inputs'
  )
  expect(filteredQuestionsWithoutAnswer).toHaveLength(2)
  expect(filteredQuestionsWithoutAnswer[0]).toBe('2')
  expect(filteredQuestionsWithoutAnswer[1]).toBe('3')
})

test('select with currency', () => {
  const currencyQuestion: AutocompleteWithActions = {
    type: 'autocomplete_with_actions',
    name: 'cur',
    hint: '',
    code: '',
    page: {} as any,
    action: {
      action_type: 'show_inputs',
      url: '',
      value_action: {
        '1': {
          type: 'show_inputs',
          codes: ['2'],
        },
      },
    },
  }

  const mock: Question[] = [
    currencyQuestion,
    {
      type: 'text',
      name: '',
      code: '2',
      hint: '',
      page: {} as any,
    },
    {
      type: 'text',
      name: '',
      code: '3',
      hint: '',
      page: {} as any,
    },
  ]

  const filteredQuestionsWithA1 = getHidedElementCodes(
    mock,
    getValue({ q: 'a1' }),
    () => '0',
    'show_inputs'
  )
  expect(filteredQuestionsWithA1).toHaveLength(1)
  expect(filteredQuestionsWithA1[0]).toBe('2')

  const filteredQuestionsWithoutA1 = getHidedElementCodes(
    mock,
    getValue({ q: 'a1' }),
    () => '1',
    'show_inputs'
  )
  expect(filteredQuestionsWithoutA1).toHaveLength(0)
})
