import { Question, ShowInputsAction } from '../types/declaration'
import { getVisibleQuestions } from '../getVisibleQuestions'

const getValue = (obj: any) => (code: string, id: number) =>
  obj[code] ? obj[code] : ''

test('basic', () => {
  const mock: Question[] = [
    {
      type: 'text',
      name: '',
      code: '1',
      hint: '',
    },
    {
      type: 'text',
      name: '',
      code: '2',
      hint: '',
    },
  ]

  const filteredQuestions = getVisibleQuestions(
    mock,
    getValue({}),
    () => false,
    0
  )
  expect(filteredQuestions).toHaveLength(2)
  expect(filteredQuestions[0].code).toBe('1')
  expect(filteredQuestions[1].code).toBe('2')
})

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

  const filteredQuestionsWithA1 = getVisibleQuestions(
    mock,
    getValue({ q: 'a1' }),
    () => false,

    0
  )
  expect(filteredQuestionsWithA1).toHaveLength(2)
  expect(filteredQuestionsWithA1[0].code).toBe('q')
  expect(filteredQuestionsWithA1[1].code).toBe('2')

  const filteredQuestionsWithA2 = getVisibleQuestions(
    mock,
    getValue({ q: 'a2' }),
    () => false,

    0
  )
  expect(filteredQuestionsWithA2).toHaveLength(2)
  expect(filteredQuestionsWithA2[0].code).toBe('q')
  expect(filteredQuestionsWithA2[1].code).toBe('3')
})

test('complex select with related questions', () => {
  const mock: Question[] = [
    {
      type: 'select',
      name: '',
      code: 'q1',
      hint: '',
      answers: [
        {
          name: '',
          code: 'a1',
          hint: '',
          action: {
            codes: ['q2', '2', '4'],
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
      type: 'select',
      name: '',
      code: 'q2',
      hint: '',
      answers: [
        {
          name: '',
          code: 'a3',
          hint: '',
          action: {
            codes: ['2'],
            type: 'show_inputs',
          } as ShowInputsAction,
        },
        {
          name: '',
          code: 'a4',
          hint: '',
          action: {
            codes: ['4'],
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
    {
      type: 'text',
      name: '',
      code: '4',
      hint: '',
    },
  ]

  const filteredWithoutAnswers = getVisibleQuestions(
    mock,
    getValue({}),
    () => false,
    0
  )
  expect(filteredWithoutAnswers).toHaveLength(1)
  expect(filteredWithoutAnswers[0].code).toBe('q1')

  const filteredQuestionsWithA1 = getVisibleQuestions(
    mock,
    getValue({ q1: 'a1' }),
    () => false,
    0
  )
  expect(filteredQuestionsWithA1).toHaveLength(2)
  expect(filteredQuestionsWithA1[0].code).toBe('q1')
  expect(filteredQuestionsWithA1[1].code).toBe('q2')

  const filteredQuestionsWith3 = getVisibleQuestions(
    mock,
    getValue({ q1: 'a2' }),
    () => false,

    0
  )
  expect(filteredQuestionsWith3).toHaveLength(2)
  expect(filteredQuestionsWith3[0].code).toBe('q1')
  expect(filteredQuestionsWith3[1].code).toBe('3')

  const filteredQuestionsWith3ButWithout1 = getVisibleQuestions(
    mock,
    getValue({ q1: 'a2', q2: 'a3' }),
    () => false,

    0
  )
  expect(filteredQuestionsWith3ButWithout1).toHaveLength(2)
  expect(filteredQuestionsWith3ButWithout1[0].code).toBe('q1')
  expect(filteredQuestionsWith3ButWithout1[1].code).toBe('3')

  const filteredQuestionsWithA1AndA3 = getVisibleQuestions(
    mock,
    getValue({
      q1: 'a1',
      q2: 'a3',
    }),
    () => false,

    0
  )
  expect(filteredQuestionsWithA1AndA3).toHaveLength(3)
  expect(filteredQuestionsWithA1AndA3[0].code).toBe('q1')
  expect(filteredQuestionsWithA1AndA3[1].code).toBe('q2')
  expect(filteredQuestionsWithA1AndA3[2].code).toBe('2')

  const filteredQuestionsWithA1AndA4 = getVisibleQuestions(
    mock,
    getValue({
      q1: 'a1',
      q2: 'a4',
    }),
    () => false,

    0
  )
  expect(filteredQuestionsWithA1AndA4).toHaveLength(3)
  expect(filteredQuestionsWithA1AndA4[0].code).toBe('q1')
  expect(filteredQuestionsWithA1AndA4[1].code).toBe('q2')
  expect(filteredQuestionsWithA1AndA4[2].code).toBe('4')
})
