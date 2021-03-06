import React, { PureComponent } from 'react'

export default class Iframe extends PureComponent {
  componentDidMount() {
    this.iframe.addEventListener('load', () => {
      this.props.handleEnter()
    })
  }

  componentWillUpdate() {
    return false
  }

  render() {
    return <iframe ref={el => { this.iframe = el }} {...this.props} />
  }
}
