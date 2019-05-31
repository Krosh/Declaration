import { Question, ShowInputsAction } from '../types/declaration'
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
      answers: [
        {
          name: '',
          code: 'a1',
          hint: '',
          action: {
            codes: ['2'],
            type: 'show_inputs',
          } as ShowInputsAction,
        },
        {
          name: '',
          code: 'a2',
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
      code: '2',
      hint: '',
    },
    {
      type: 'text',
      name: '',
      code: '3',
      hint: '',
    },
  ]

  const filteredQuestionsWithA1 = getHidedElementCodes(
    mock,
    getValue({ q: 'a1' }),
    () => false,
    'show_inputs'
  )
  expect(filteredQuestionsWithA1).toHaveLength(1)
  expect(filteredQuestionsWithA1[0]).toBe('3')

  const filteredQuestionsWithA2 = getHidedElementCodes(
    mock,
    getValue({ q: 'a2' }),
    () => false,
    'show_inputs'
  )
  expect(filteredQuestionsWithA2).toHaveLength(1)
  expect(filteredQuestionsWithA2[0]).toBe('2')

  const filteredQuestionsWithoutAnswer = getHidedElementCodes(
    mock,
    getValue({}),
    () => false,
    'show_inputs'
  )
  expect(filteredQuestionsWithoutAnswer).toHaveLength(2)
  expect(filteredQuestionsWithoutAnswer[0]).toBe('2')
  expect(filteredQuestionsWithoutAnswer[1]).toBe('3')
})
