import { Question, ShowInputsAction } from '../types/declaration'
import { getVisibleQuestions } from '../getVisibleQuestions'
import validate from '../validation'

test('test non-empty text is valid', () => {
  expect(validate('', {}, () => '123', true)).toHaveLength(0)
})

test('test empty text is invalid', () => {
  expect(validate('', {}, () => '', true)).toHaveLength(1)
})

test('test empty non-requred text is valid', () => {
  expect(validate('', {}, () => '', false)).toHaveLength(0)
})

test('test empty non-requred text is valid', () => {
  expect(
    validate(
      '',
      {
        canBeSkipped: true,
      },
      () => '',
      true
    )
  ).toHaveLength(0)
})

test('test empty two of text is invalid', () => {
  expect(
    validate(
      'empty',
      {
        oneOf: ['empty', 'non-empty'],
      },
      code => '',
      true
    )
  ).toHaveLength(1)
})

test('test empty one of text is valid', () => {
  expect(
    validate(
      'empty',
      {
        oneOf: ['empty', 'non-empty'],
      },
      code => (code === 'non-empty' ? 'value' : ''),
      true
    )
  ).toHaveLength(0)
})

test('test empty one of text is valid', () => {
  expect(
    validate(
      'empty',
      {
        oneOf: ['empty', 'non-empty'],
      },
      () => 'value',
      true
    )
  ).toHaveLength(0)
})
