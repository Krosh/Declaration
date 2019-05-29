import * as React from 'react'
import { FullyLoadedDeclaration, Page } from '../types/declaration'

interface Props {
  schema: FullyLoadedDeclaration
  children: (props: {
    isActiveTab: (tab: string) => boolean
    setActiveTab: (tab: string) => void
    isActivePage: (page: Page) => boolean
    setActivePage: (page: Page) => void
  }) => JSX.Element
}

interface State {
  activePage: Page
  activeTab: string
}

export default class ActivePageKeeper extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      activePage: props.schema.pages[0],
      activeTab: props.schema.pages[0].tab,
    }
  }

  setActivePage = (page: Page) => {
    this.setState({ activePage: page })
  }

  setActiveTab = (tab: string) => {
    this.setState({ activeTab: tab })
  }

  isActiveTab = (tab: string) => this.state.activeTab === tab
  isActivePage = (page: Page) => this.state.activePage.id === page.id

  public render() {
    return this.props.children({
      isActivePage: this.isActivePage,
      isActiveTab: this.isActiveTab,
      setActivePage: this.setActivePage,
      setActiveTab: this.setActiveTab,
    })
  }
}
