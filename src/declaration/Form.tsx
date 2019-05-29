import { withStyles } from '@material-ui/core'
import * as React from 'react'
import dataProvider from '../dataProvider'
import env from '../env'
import {
  FullyLoadedDeclaration,
  processAnswers,
  processData,
} from '../types/declaration'
import ActivePageKeeper from './ActivePageKeeper'
import './declaration.css'
import FormDataKeeper from './FormDataKeeper'
import NavigationComponent from './Navigation'
import QuestionComponent from './Question'
import RendererComponent, { DeclarationFormProps } from './Renderer'

export interface FormProps {
  classes?: any
  match: {
    // TODO:: нормальная типизация
    params: {
      id: string
    }
  }
}

export interface FormState {
  schema: FullyLoadedDeclaration | undefined
  initialValues: { [key: string]: string }
}

class FormComponent extends React.Component<FormProps, FormState> {
  constructor(props: FormProps) {
    super(props)
    this.state = {
      schema: undefined,
      initialValues: {},
    }
  }

  renderLoading = () => {
    return <div>Загрузка...</div>
  }

  renderSchema = () => {
    const saveAnswer = (questionCode: string, id: number, value: string) => {
      dataProvider()('', 'answer-save', {
        data: {
          answers: [
            {
              value: value,
              declaration_id: this.props.match.params.id,
              multiple_id: id,
              question_code: questionCode,
            },
          ],
        },
      })
    }

    const deleteMultiple = (questionCode: string, id: number) => {
      dataProvider()('', 'multiple-delete', {
        data: {
          declaration_id: this.props.match.params.id,
          multiple_id: id,
          question_code: questionCode,
        },
      })
    }

    const copyMultiple = (questionCode: string, id: number, newId: number) => {
      dataProvider()('', 'multiple-copy', {
        data: {
          declaration_id: this.props.match.params.id,
          multiple_id: id,
          new_multiple_id: newId,
          question_code: questionCode,
        },
      })
    }

    return (
      <ActivePageKeeper schema={this.state.schema!}>
        {props => (
          <FormDataKeeper
            schema={this.state.schema!}
            saveAnswer={saveAnswer}
            copyMultiple={copyMultiple}
            deleteMultiple={deleteMultiple}
            initialValues={this.state.initialValues}
          >
            {innerProps => (
              <RendererComponent
                {...props}
                {...innerProps}
                schema={this.state.schema!}
              >
                {(form: DeclarationFormProps) => {
                  return (
                    <div className="declaration-wrapper">
                      <div className="declaration-form-wrapper">
                        <form
                          action="javascript:void(0)"
                          method="POST"
                          className={'simple-form ' + this.props.classes.form}
                        >
                          {form.questions.map(item =>
                            QuestionComponent({
                              ...form,
                              question: item,
                              id: 0,
                            })
                          )}
                        </form>
                        <a
                          href={`${env.url}/declarations/print/${
                            this.props.match.params.id
                          }`}
                          target="_blank"
                        >
                          Распечатать декларацию
                        </a>
                      </div>
                      <div>
                        <NavigationComponent form={form} />
                      </div>
                    </div>
                  )
                }}
              </RendererComponent>
            )}
          </FormDataKeeper>
        )}
      </ActivePageKeeper>
    )
  }

  public render() {
    return undefined === this.state.schema
      ? this.renderLoading()
      : this.renderSchema()
  }

  async componentDidMount() {
    const [{ data: answers }, { data: schema }] = await Promise.all([
      dataProvider()('', 'declaration-fill', {
        id: this.props.match.params.id,
      }),
      dataProvider()('', 'year-schema', {
        id: 1, // TODO:: брать код года из декларации
      }),
    ])
    this.setState({
      schema: processData(schema) as any,
      initialValues: processAnswers(answers),
    })
  }
}

const styles = (theme: any) => ({
  form: {
    [theme.breakpoints.up('sm')]: {
      padding: '0 1em 1em 1em',
    },
    [theme.breakpoints.down('xs')]: {
      padding: '0 1em 5em 1em',
    },
    display: 'flex',
    flexDirection: 'column' as any,
  },
})

export default withStyles(styles)(FormComponent)
