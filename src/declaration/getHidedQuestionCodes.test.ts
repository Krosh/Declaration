import { Question, ShowInputsAction } from '../types/declaration'
import { getVisibleQuestions, getHidedQuestionCodes } from './logic'

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

  const filteredQuestionsWithA1 = getHidedQuestionCodes(
    mock,
    getValue({ q: 'a1' }),
    'show_inputs'
  )
  expect(filteredQuestionsWithA1).toHaveLength(1)
  expect(filteredQuestionsWithA1[0]).toBe('3')

  const filteredQuestionsWithA2 = getHidedQuestionCodes(
    mock,
    getValue({ q: 'a2' }),
    'show_inputs'
  )
  expect(filteredQuestionsWithA2).toHaveLength(1)
  expect(filteredQuestionsWithA2[0]).toBe('2')

  const filteredQuestionsWithoutAnswer = getHidedQuestionCodes(
    mock,
    getValue({}),
    'show_inputs'
  )
  expect(filteredQuestionsWithoutAnswer).toHaveLength(2)
  expect(filteredQuestionsWithoutAnswer[0]).toBe('2')
  expect(filteredQuestionsWithoutAnswer[1]).toBe('3')
})
