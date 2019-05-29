import { withStyles } from '@material-ui/core'
import * as React from 'react'
import dataProvider from '../dataProvider'
import { FullyLoadedDeclaration, processData } from '../types/declaration'
import QuestionComponent from './Question'
import RendererComponent, { DeclarationFormProps } from './Renderer'
import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'
import env from '../env'
import classNames from 'classnames'

export interface FormProps {
  form: DeclarationFormProps
}

class NavigationComponent extends React.Component<FormProps> {
  renderItem = (
    name: string,
    isTab: boolean,
    isFilled: boolean,
    errorText: string | undefined,
    onClick: () => void
  ) => {
    return (
      <div
        className={classNames('navigation-item', {
          tab: isTab,
          filled: isFilled,
          error: !!errorText,
        })}
        onClick={onClick}
      >
        <div className="circle" />
        <div className="text">{name}</div>
      </div>
    )
  }
  render() {
    return (
      <div className="navigation-wrapper">
        {this.props.form.tabs.map(tab => {
          const isActiveTab = this.props.form.isActiveTab(tab)
          return (
            <React.Fragment>
              {this.renderItem(tab, true, isActiveTab, undefined, () => {
                this.props.form.setActiveTab(tab)
              })}
              {isActiveTab &&
                this.props.form.pages.map(page =>
                  this.renderItem(
                    page.name,
                    false,
                    true,
                    this.props.form.getPageErrors(page.code)[0],
                    () => {
                      this.props.form.setActivePage(page)
                    }
                  )
                )}
            </React.Fragment>
          )
        })}
      </div>
    )
  }
}

export default NavigationComponent
