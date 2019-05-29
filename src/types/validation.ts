import { Question } from './declaration'
import Joi from 'joi'

const getQuestionValidator = (question: Question) => {
  if (question.type === 'text') {
    return Joi.string().required()
  }
  if (question.type === 'radio') {
    return Joi.string()
      .only(...question.answers.map(item => item.code))
      .required()
  }
  if (question.type === 'multiple') {
    const innerValidator: { [key: string]: Joi.Schema } = {}
    question.answers.forEach(firstLevelQuestion => {
      innerValidator[firstLevelQuestion.code] = getQuestionValidator(
        firstLevelQuestion
      )
    })
    return Joi.object().keys(innerValidator)
  }
  return Joi.any().optional()
}

const createValidator = (questionsMap: { [key: string]: Question }) => {
  const questionsValidators: { [key: string]: Joi.Schema } = {}
  Object.values(questionsMap).forEach(question => {
    questionsValidators[question.code] = getQuestionValidator(question)
  })
  return questionsValidators
}

export default createValidator
