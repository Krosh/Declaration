import * as React from 'react'
import Declaration from '.'

interface Props {
  children: (declaraton: Declaration) => JSX.Element
  declaration: Declaration
}

export default class extends React.Component<Props> {
  constructor(props: Props) {
    super(props)
    props.declaration.setRerenderCallback(() => this.forceUpdate())
  }

  render() {
    return this.props.children(this.props.declaration)
  }
}
