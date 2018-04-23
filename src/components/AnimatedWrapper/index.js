import React, { PureComponent } from 'react'
import className from '../../utils/className'
import './index.styl'

const AnimatedWrapper = AnimatedContent =>
  class AnimatedWrapper extends PureComponent {
    constructor(props) {
      super(props)
      this.state = {
        aniAppear: false,
        aniAppearActive: false,
        aniLeave: false,
        aniLeaveActive: false,
      }
    }

    componentDidMount() {
      const { history, async } = this.props
      if (history.action !== 'POP' && !async) {
        this.handleEnter()
      }
    }

    componentWillUpdate({ location: nextLocation, history: nextHistory }) {
      const { location, history, async } = this.props
      const { aniLeave } = this.state
      if (location.pathname !== nextLocation.pathname &&
        history.action === 'PUSH' &&
        !aniLeave &&
        !async
      ) {
        this.handleLeave()
      }
    }

    handleEnter = () => {
      const { appearDuration = 300 } = this.props

      this.setState({ aniAppear: true })
      window.setTimeout(() => {
        this.setState({ aniAppearActive: true })
      }, 0)

      window.setTimeout(() => {
        this.setState({ aniAppear: false, aniAppearActive: false })
      }, appearDuration)
    }

    handleLeave = () => {
      const { leaveDuration = 300 } = this.props
      this.setState({ aniLeave: true })
      window.setTimeout(() => { this.setState({ aniLeaveActive: true }) }, 0)
      window.setTimeout(() => {
        this.setState({ aniLeave: false, aniLeaveActive: false })
      }, leaveDuration)
    }

    render() {
      const { aniAppear, aniAppearActive, aniLeave, aniLeaveActive } = this.state
      const wrapClassName = className({ aniAppear, aniAppearActive, aniLeave, aniLeaveActive }, 'aniWrap')
      return (
        <div>
          <div className={wrapClassName}>
            <AnimatedContent {...this.props} handleEnter={this.handleEnter} handleLeave={this.handleLeave} />
          </div>
          {AnimatedContent.renderAdditional && AnimatedContent.renderAdditional(this.props)}
        </div>
      )
    }
  }

export default AnimatedWrapper
