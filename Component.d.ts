import * as React from 'react'
import Declaration from './src'
interface Props {
  children: (declaraton: Declaration) => JSX.Element
  declaration: Declaration
}
export default class extends React.Component<Props> {
  constructor(props: Props)
  render(): JSX.Element
}
export {}
