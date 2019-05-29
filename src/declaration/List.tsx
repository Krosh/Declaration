import { withStyles } from '@material-ui/core'
import * as React from 'react'
// @ts-ignore
import { NavLink } from 'react-router-dom'
export interface FormProps {
  classes?: any
}

class FormComponent extends React.Component<FormProps> {
  constructor(props: FormProps) {
    super(props)
  }

  public render() {
    const ids = Array.from(new Array(10)).map((item, index) => index + 1)
    return ids.map(index => {
      return (
        <div>
          <h3>Декларация №{index}</h3>
          <NavLink to={`/declaration/${index}`}>Перейти</NavLink>
        </div>
      )
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
